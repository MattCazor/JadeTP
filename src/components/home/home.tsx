import styles from './home.module.css';
import User from '@/lib/users/user';
import ChatWindow from './chat/chat-window';
import MessageWindow from './message/message-window';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';

type HomeProps = {
    user: User
}

export const HomeComponent = ({ user }: HomeProps) => {

    const { status } = useSupabase();

    return (
        <div className={styles.home_wrapper}>
            <div className={`${styles.chat_window_wrapper} ${status == MessageWindowStatus.NO_ACTION ? styles.show : styles.hide}`}>
                <ChatWindow user={user} />
            </div>
            <div className={`${styles.message_window_wrapper}  ${status == MessageWindowStatus.NO_ACTION ? styles.hide : styles.show}`}>
                <MessageWindow user={user} />
            </div>
        </div >
    )
};