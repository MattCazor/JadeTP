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

    const { setStatus } = useSupabase();

    const getUserToDisplay = (): User => {
        // this method returns the user with whom the current user is chatting with
        // if the last message was sent by the current user, then the reciever is the user to display, else the sender is the user to display
        if (message.getSender().getId() === user.getId()) {
            return message.getReciever()
        }
        return message.getSender();

    }

    const handleMessageTouch = () => {
        // run when the user touched a message

        setStatus(MessageWindowStatus.CONVERSATION);
    }

    return (
        <div className={styles.row} onClick={handleMessageTouch}>
            <div className={styles.row_flat}>
                <ProfilePicture initials={getUserToDisplay().getInitials()} />
                <div className={styles.row_content}>
                    <div className={`${styles.sender} ${!message.getHasBeenRead() ? styles.not_read : ''}`}>{getUserToDisplay().getFullName()}</div>
                    <div className={`${styles.message} ${!message.getHasBeenRead() ? styles.not_read : ''}`}>{message.getMessage()}</div>
                </div>
            </div>
            {!message.getHasBeenRead() && <div className={styles.not_read_dot}></div>}
        </div>
    )
};

export default ChatRow;