import styles from './home.module.css';
import User from '@/lib/users/user';
import ChatWindow from './chat/chat-window';
import MessageWindow from './message/message-window';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import { useEffect, useState } from 'react';
import Message from '@/lib/messages/message';

type HomeProps = {
    user: User
}

export const HomeComponent = ({ user }: HomeProps) => {

    const { status, supabase, selectedUser } = useSupabase();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, [selectedUser]);

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
            console.log('error2');
            alert(error.message);
            return;
        }
        if (data) {
            const newMessages: Message[] = handleMessagesList(data);
            setMessages(newMessages);

            // set the new message to read if the current user has the conversation open
            if (selectedUser) {
                // get the id of the last message sent by the selected user
                const lastMessageId = newMessages.find((message) => message.getSender().getId() === selectedUser.getId())?.getId();
                if (!lastMessageId) return;
                const { error } = await supabase.from('messages').update({ read: true }).eq('id', lastMessageId);
                if (error) {
                    console.log('error3');
                    alert(error.message);
                    return;
                }


            }
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

    const handleMessagesList = (data: any): Message[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // this method takes into input all the messages and display them by selecting only the last in each conversation
        const messages = [];
        for (const messageMap of data) {
            const sender = new User(messageMap.sender.id, messageMap.sender.first_name, messageMap.sender.last_name);
            const receiver = new User(messageMap.receiver.id, messageMap.receiver.first_name, messageMap.receiver.last_name);
            const message = new Message(messageMap.id, sender, receiver, messageMap.message, messageMap.read, messageMap.created_at);
            messages.push(message);
        }
        return messages;
    }

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
    return (
        <div className={styles.home_wrapper}>
            <div className={`${styles.chat_window_wrapper} ${status == MessageWindowStatus.NO_ACTION ? styles.show : styles.hide}`}>
                <ChatWindow user={user} messages={messages} isLoading={isLoading} />
            </div>
            <div className={`${styles.message_window_wrapper}  ${status == MessageWindowStatus.NO_ACTION ? styles.hide : styles.show}`}>
                <MessageWindow user={user} messages={messages} />
            </div>
        </div >
    )
};