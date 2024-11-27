import ProfilePicture from '@/components/misc/profile-picture';
import styles from './chat-window.module.css';
import User from '@/lib/users/user';
import { useRouter } from 'next/router';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import Message from '@/lib/messages/message';
import ChatRow from './chat-row';
import EmptyScreen from '@/components/misc/empty-screen/empty-screen';
import { LoadingScreen } from '@/components/misc/loading/loading-screen';

type ChatWindowProps = {
    user: User,
    messages: Message[],
    isLoading: boolean
}

export const ChatWindow = ({ user, messages, isLoading }: ChatWindowProps) => {
    const router = useRouter();
    const { supabase, setStatus, setSelectedUser } = useSupabase();

    const handleMessagesList = (data: Message[]): Message[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // this method takes into input all the messages and display them by selecting only the last in each conversation
        const messages = [];
        const otherUserIds: string[] = [];
        for (const messageMap of data) {
            const userToCheck = messageMap.getSender().getId() === user.getId() ? messageMap.getReciever().getId() : messageMap.getSender().getId();
            if (!otherUserIds.includes(userToCheck)) {
                messages.push(messageMap);
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
                    handleMessagesList(messages).map((message) => <ChatRow key={message.getId()} message={message} user={user} />)
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