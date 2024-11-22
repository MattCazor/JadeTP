import styles from './message-window.module.css';
import EmptyScreen from '../misc/empty-screen/empty-screen';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';



export const MessageWindow = () => {

    const { status } = useSupabase();

    const displayWindow = (): React.ReactNode => {
        switch (status) {
            case MessageWindowStatus.NO_ACTION:
                return <EmptyScreen icon='comment' message='Sélectionnez une conversation pour la visualiser.' />;
            case MessageWindowStatus.NEW_MESSAGE:
                return <>Écire un nouveau message</>
            case MessageWindowStatus.CONVERSATION:
                return <>Conversation</>
        }
    };

    return (
        <article className={styles.message_window}>
            {displayWindow()}
        </article>
    )
};

export default MessageWindow;