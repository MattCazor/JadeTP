import ProfilePicture from "@/components/misc/profile-picture";
import User from "@/lib/users/user";
import styles from './conversation.module.css';
import { useEffect, useState } from "react";
import { MessageWindowStatus, useSupabase } from "@/pages/supabaseProvider";
import Message from "@/lib/messages/message";

type ConversationProps = {
    user: User // logged in user
    otherUser: User // other person in the conversation
    messages: Message[] // all the messages in the conversation
}

export const Conversation = ({ user, otherUser, messages }: ConversationProps) => {

    const { setStatus, setSelectedUser, supabase, selectedUser } = useSupabase();

    // the new message input value
    const [message, setMessage] = useState('');

    const sendMessage = async () => {
        // get the message
        if (message == '') {
            alert('Veuillez saisir un message');
            return;
        }

        const { error } = await supabase.from('messages').insert([
            {
                receiver: selectedUser?.getId(),
                sender: user.getId(),
                message: message,
                read: false
            }
        ]);
        if (error) {
            alert(error.message);
            return;
        }
        setMessage('');

    }

    const handleGoback = () => {
        setStatus(MessageWindowStatus.NO_ACTION);
        setSelectedUser(null);
    }

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);

        // first check if the date is today
        const now = new Date();
        if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
            return `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;
        }

        // check if the date is within the past year
        if (date.getFullYear() === now.getFullYear()) {
            return `${leadingZero(date.getDate())}/${leadingZero(date.getMonth() + 1)} à ${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;
        }

        // the date is older than a year
        return `${leadingZero(date.getDate())}/${leadingZero(date.getMonth() + 1)}/${date.getFullYear()} à ${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}`;


    }


    const leadingZero = (value: number): string => {
        return value < 10 ? `0${value}` : `${value}`;
    }
    const buildConversation = (): React.ReactNode => {
        return (
            messages.map((message) => {
                if (message.getSender().getId() === user.getId()) {
                    // logged in user has sent the message
                    return (
                        <div key={message.getId()} className={`${styles.message_wrapper} ${styles.sender_wrapper}`}>
                            <div className={`${styles.message} ${styles.sender}`}>
                                <div>{message.getMessage()}</div>
                                <div className={`${styles.timestamp} ${styles.sender}`}>{formatTimestamp(message.getCreatedAt())}</div>
                            </div>
                        </div>
                    )
                }
                // other user has sent the message
                return (
                    <div key={message.getId()} className={styles.message_wrapper}>
                        <div className={styles.message}>
                            <div className={styles.message_text}>{message.getMessage()}</div>
                            <div className={styles.timestamp}>{formatTimestamp(message.getCreatedAt())}</div>
                        </div>
                    </div>
                )
            })
        )
    };

    return (
        <div className={styles.conversationWrapper}>
            <div className={styles.profile}>
                <div className='goBack' onClick={handleGoback}><span className="material-symbols-outlined">arrow_back_ios</span></div>
                <ProfilePicture initials={otherUser.getInitials()} />
                {otherUser.getFullName()}
            </div>
            <div className="hSep" />
            <div className={styles.conversation}>
                {buildConversation()}
            </div>
            <fieldset role="group">
                <input name="text" type="text" placeholder="Saisir un message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <input type="submit" value="Envoyer" onClick={sendMessage} />
            </fieldset>
        </div >
    );
};

export default Conversation;