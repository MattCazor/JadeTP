import styles from './message-window.module.css';
import EmptyScreen from '../../misc/empty-screen/empty-screen';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import { useEffect, useState } from 'react';
import User from '@/lib/users/user';
import NewMessage from './new_message/new_message';


type MessageWindowProps = {
    user: User
}

export const MessageWindow = ({ user }: MessageWindowProps) => {

    const { status } = useSupabase();

    const displayWindow = (): React.ReactNode => {
        switch (status) {
            case MessageWindowStatus.NO_ACTION:
                return <EmptyScreen icon='comment' message='Sélectionnez une conversation pour la visualiser.' />;
            case MessageWindowStatus.NEW_MESSAGE:
                return <NewMessage user={user} />
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