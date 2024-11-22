import styles from './home.module.css';
import User from '@/lib/users/user';
import ChatWindow from './chat/chat-window';
import MessageWindow from './message-window';

type HomeProps = {
    user: User
}

export const HomeComponent = ({ user }: HomeProps) => {

    return (
        <div className={styles.home_wrapper}>
            <div className={styles.chat_window_wrapper}>
                <ChatWindow user={user} />
            </div>
            <div className={styles.message_window_wrapper}>
                <MessageWindow />
            </div>
        </div >
    )
};