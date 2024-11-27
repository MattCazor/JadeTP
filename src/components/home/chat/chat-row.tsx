import ProfilePicture from "@/components/misc/profile-picture";
import Message from "@/lib/messages/message";
import User from "@/lib/users/user";

import styles from './chat-row.module.css';
import { MessageWindowStatus, useSupabase } from "@/pages/supabaseProvider";

type ChatRowProps = {
    message: Message,
    user: User // current user logged in
}

export const ChatRow = ({ message, user }: ChatRowProps) => {

    const { setStatus, supabase, selectedUser, setSelectedUser } = useSupabase();

    const getUserToDisplay = (): User => {
        // this method returns the user with whom the current user is chatting with
        // if the last message was sent by the current user, then the reciever is the user to display, else the sender is the user to display
        if (message.getSender().getId() === user.getId()) {
            return message.getReciever()
        }
        return message.getSender();

    }

    const handleMessageTouch = async () => {
        // run when the user touched a message

        // set the message to read
        const { error } = await supabase.from('messages').update({ read: true }).eq('id', message.getId());
        setSelectedUser(getUserToDisplay());
        setStatus(MessageWindowStatus.CONVERSATION);
    }

    const shouldBeDisplayedAsNotRead = (): boolean => {
        // this method returns true if the message has not been read and the current user is the reciever
        return !message.getHasBeenRead() && message.getReciever().getId() === user.getId();
    }


    return (
        <div className={`${styles.row} ${selectedUser?.getId() === getUserToDisplay().getId() ? styles.row_active : ''}`} onClick={handleMessageTouch}>
            <div className={styles.row_flat}>
                <ProfilePicture initials={getUserToDisplay().getInitials()} />
                <div className={styles.row_content}>
                    <div className={`${styles.sender} ${shouldBeDisplayedAsNotRead() ? styles.not_read : ''}`}>{getUserToDisplay().getFullName()}</div>
                    <div className={styles.message_row}>
                        <div className={`${styles.message} ${shouldBeDisplayedAsNotRead() ? styles.not_read : ''}`}>{user.getId() == message.getSender().getId() ? 'Vous : ' : ''}{message.getMessage()}</div>
                        <div className={styles.time}>{message.getCreatedAt()}</div>
                    </div>
                </div>
            </div>
            {shouldBeDisplayedAsNotRead() && <div className={styles.not_read_dot}></div>}
        </div>
    )
};

export default ChatRow;