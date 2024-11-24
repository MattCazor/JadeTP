import ProfilePicture from '@/components/misc/profile-picture';
import styles from './chat-window.module.css';
import User from '@/lib/users/user';
import { useRouter } from 'next/router';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import { useEffect, useState } from 'react';
import Message from '@/lib/messages/message';
import ChatRow from './chat-row';
import EmptyScreen from '@/components/misc/empty-screen/empty-screen';

type ChatWindowProps = {
    user: User
}

export const ChatWindow = ({ user }: ChatWindowProps) => {
    const router = useRouter();
    const { supabase, setStatus } = useSupabase();


    const [messages, setMessages] = useState<Message[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select(`
            *,
            receiver:profiles!receiver (id, first_name, last_name),
            sender:profiles!sender (id, first_name, last_name)
            `)
            .or(`receiver.eq.${user.getId()},sender.eq.${user.getId()}`)
            .order('created_at', { ascending: false });
        if (error) {
            alert(error.message);
            return;
        }
        if (data) {
            setMessages(handleMessagesList(data));
        }

        // stream upadates (messages switches to read)
        supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                },
                (payload) => handleOnMessageUpdate(payload)
            )
            .subscribe()
    };

    const handleOnMessageUpdate = async (payload: any) => {
        // function called when there is a message update
        setMessages((prevMessages) => {
            let newMessages = prevMessages.map(message => {
                if (message.getId() === payload.new.id) {
                    return new Message(payload.new.id, message.getSender(), message.getReciever(), payload.new.message, payload.new.read, payload.new.created_at);
                }
                return message;
            });

            return newMessages;
        });
    };

    const handleMessagesList = (data: any): Message[] => {
        // this method takes into input all the messages and display them by selecting only the last in each conversation
        let messages = [];
        const otherUserIds: any[] = [];
        for (let messageMap of data) {
            if (!otherUserIds.includes(messageMap.sender.id)) {
                let sender = new User(messageMap.sender.id, messageMap.sender.first_name, messageMap.sender.last_name);
                let receiver = new User(messageMap.receiver.id, messageMap.receiver.first_name, messageMap.receiver.last_name);
                let message = new Message(messageMap.id, sender, receiver, messageMap.message, messageMap.read, messageMap.created_at);
                messages.push(message);
                otherUserIds.push(messageMap.sender.id);
            }
        }
        console.log(messages);
        return messages;
    }


    const handleSignOut = async () => {
        // to logout the superbase
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleNewMessage = async () => {
        setStatus(MessageWindowStatus.NEW_MESSAGE);
    };
    return (
        <article className={styles.chat_window}>
            <div className={styles.top_bar}>
                <h1 className={styles.h1}>Messages</h1>
                <div className={styles.icon_button} onClick={handleNewMessage}>
                    <span className="material-symbols-outlined">edit_square</span>
                </div>
            </div>
            <div className='hSep' />
            <div className={styles.messages}>
                {messages.length == 0 && (
                    <EmptyScreen message='Commencez à discuter en envoyant un message' icon='communication' />
                )}
                {messages.length > 0 && (
                    messages.map((message) => <ChatRow key={message.getId()} message={message} user={user} />)
                )}
            </div>
            <div className='hSep' />
            <div className={styles.bottom_profile}>
                <div className={styles.profile}>
                    <ProfilePicture initials={user.getInitials()} />
                    {user.getFullName()}
                </div>
                <div className={styles.icon_button} onClick={handleSignOut}>
                    <span className="material-symbols-outlined">logout</span>
                </div>
            </div>

        </article >
    )
};

export default ChatWindow;