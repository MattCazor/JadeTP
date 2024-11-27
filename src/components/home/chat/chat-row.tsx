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
        if (error) {
            console.log('error4');
            alert(error.message);
            return;
        }
        setSelectedUser(getUserToDisplay());
        setStatus(MessageWindowStatus.CONVERSATION);
    }

    const shouldBeDisplayedAsNotRead = (): boolean => {
        // this method returns true if the message has not been read and the current user is the reciever
        return !message.getHasBeenRead() && message.getReciever().getId() === user.getId();
    }

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        // first check if the date is today
        const now = new Date();
        if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
            return `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;
        }

        // check if the date is yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear()) {
            return 'Hier';
        }

        // check if the date is within the past 7 days
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        if (date >= sevenDaysAgo) {
            const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
            return days[date.getDay()];
        }

        // check if the date is within the past year
        if (date.getFullYear() === now.getFullYear()) {
            return `${leadingZero(date.getDate())}/${leadingZero(date.getMonth() + 1)}`;
        }

        // if the date is older, return the date
        return `${leadingZero(date.getDate())}/${leadingZero(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    const leadingZero = (value: number): string => {
        return value < 10 ? `0${value}` : `${value}`;
    }


    return (
        <div className={`${styles.row} ${selectedUser?.getId() === getUserToDisplay().getId() ? styles.row_active : ''}`} onClick={handleMessageTouch}>
            <div className={styles.row_flat}>
                <ProfilePicture initials={getUserToDisplay().getInitials()} />
                <div className={styles.row_content}>
                    <div className={`${styles.sender} ${shouldBeDisplayedAsNotRead() ? styles.not_read : ''} `}>{getUserToDisplay().getFullName()}</div>
                    <div className={styles.message_row}>
                        <div className={`${styles.message} ${shouldBeDisplayedAsNotRead() ? styles.not_read : ''} `}>{user.getId() == message.getSender().getId() ? 'Vous : ' : ''}{message.getMessage()}</div>
                        <div className={styles.time}>{formatTimestamp(message.getCreatedAt())}</div>
                    </div>
                </div>
            </div>
            {shouldBeDisplayedAsNotRead() && <div className={styles.not_read_dot}></div>}
        </div>
    )
};

export default ChatRow;