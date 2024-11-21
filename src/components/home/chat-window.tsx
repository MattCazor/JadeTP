import styles from './chat-window.module.css';
import User from '@/lib/users/user';

type ChatWindowProps = {
    user: User
}

export const ChatWindow = ({ user }: ChatWindowProps) => {
    return (
        <div className={styles.chat_window}>
            <div>Chats</div>
        </div>
    )
};

export default ChatWindow;