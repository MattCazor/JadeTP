import ProfilePicture from '@/components/misc/profile-picture';
import styles from './chat-window.module.css';
import User from '@/lib/users/user';
import { useRouter } from 'next/router';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import { useState } from 'react';
import Message from '@/lib/messages/message';
import ChatRow from './chat-row';
import EmptyScreen from '@/components/misc/empty-screen/empty-screen';

type ChatWindowProps = {
    user: User
}

export const ChatWindow = ({ user }: ChatWindowProps) => {
    const router = useRouter();
    const { supabase, setStatus } = useSupabase();

    const sender = new User('123', 'John', 'Doe');
    const receiver = new User('123', 'Steve', 'Smith');
    const mockMessages = [
        new Message('id', sender, receiver, 'Hello', false, 'timestamp'),
        new Message('id', receiver, sender, 'Hi', true, 'timestamp'),
    ]

    const [messages, setMessages] = useState<Message[]>([]);


    const handleSignOut = async () => {
        // to logout the super
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleNewMessage = async () => {
        setStatus(MessageWindowStatus.NEW_MESSAGE);
    };
    return (
        <article className={styles.chat_window}>
            <div className={styles.top_bar}>
                <h1>Messages</h1>
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
                    messages.map((message) => <ChatRow message={message} user={user} />)
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