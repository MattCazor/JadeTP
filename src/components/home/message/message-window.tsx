import styles from './message-window.module.css';
import EmptyScreen from '../../misc/empty-screen/empty-screen';
import { MessageWindowStatus, useSupabase } from '@/pages/supabaseProvider';
import User from '@/lib/users/user';
import NewMessage from './new_message/new_message';
import Conversation from './conversation/conversation';
import Message from '@/lib/messages/message';


type MessageWindowProps = {
    user: User // logged in user
    messages: Message[] // all the messages
}

export const MessageWindow = ({ user, messages }: MessageWindowProps) => {

    const { status, selectedUser } = useSupabase();


    const filterMessages = (messages: Message[]): Message[] => {
        // keep only messages where sender or receiver is the logged in user or the selected user
        const filteredMessages = messages.filter((message) => {
            return (message.getSender().getId() === user.getId() && message.getReciever().getId() === selectedUser?.getId()) || (message.getSender().getId() === selectedUser?.getId() && message.getReciever().getId() === user.getId());
        });
        // reverse the order of the messages
        return filteredMessages.reverse();

    }

    const displayWindow = (): React.ReactNode => {
        switch (status) {
            case MessageWindowStatus.NO_ACTION:
                return <EmptyScreen icon='comment' message='Sélectionnez une conversation pour la visualiser.' />;
            case MessageWindowStatus.NEW_MESSAGE:
                return <NewMessage user={user} />
            case MessageWindowStatus.CONVERSATION:
                return <Conversation user={user} otherUser={selectedUser!} messages={filterMessages(messages)} />
        }
    };


    return (
        <article className={styles.message_window}>
            {displayWindow()}
        </article>
    )
};

export default MessageWindow;