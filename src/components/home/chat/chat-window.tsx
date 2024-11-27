import ProfilePicture from '@/components/misc/profile-picture';
import styles from './chat-window.module.css';
import User from '@/lib/users/user';
import { useRouter } from 'next/router';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import { useEffect, useState } from 'react';
import Message from '@/lib/messages/message';
import ChatRow from './chat-row';
import EmptyScreen from '@/components/misc/empty-screen/empty-screen';
import { LoadingScreen } from '@/components/misc/loading/loading-screen';

type ChatWindowProps = {
    user: User
}

export const ChatWindow = ({ user }: ChatWindowProps) => {
    const router = useRouter();
    const { supabase, setStatus, setSelectedUser } = useSupabase();


    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);

        // stream upadates (messages switches to read) or new messages
        supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                },
                () => fetchMessages()
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public'
                },
                (payload) => handleOnMessageUpdate(payload))
            .subscribe()
    };

    const handleOnMessageUpdate = async (payload: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // function called when there is a message update
        setMessages((prevMessages) => {
            return prevMessages.map(message => {
                if (message.getId() === payload.new.id) {
                    return new Message(payload.new.id, message.getSender(), message.getReciever(), payload.new.message, payload.new.read, payload.new.created_at);
                }
                return message;
            });
        });
    };

    const handleMessagesList = (data: any): Message[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // this method takes into input all the messages and display them by selecting only the last in each conversation
        const messages = [];
        const otherUserIds: string[] = [];
        for (const messageMap of data) {
            const userToCheck = messageMap.sender.id === user.getId() ? messageMap.receiver.id : messageMap.sender.id;
            if (!otherUserIds.includes(userToCheck)) {
                const sender = new User(messageMap.sender.id, messageMap.sender.first_name, messageMap.sender.last_name);
                const receiver = new User(messageMap.receiver.id, messageMap.receiver.first_name, messageMap.receiver.last_name);
                const message = new Message(messageMap.id, sender, receiver, messageMap.message, messageMap.read, messageMap.created_at);
                messages.push(message);
                otherUserIds.push(userToCheck);
            }
        }
        return messages;
    }


    const handleSignOut = async () => {
        // to logout the superbase
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleNewMessage = async () => {
        setSelectedUser(null);
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
                {messages.length == 0 && isLoading && (
                    <LoadingScreen />
                )}
                {messages.length == 0 && !isLoading && (
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