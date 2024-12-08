import ProfilePicture from "@/components/misc/profile-picture";
import User from "@/lib/users/user";
import styles from './conversation.module.css';
import { useEffect, useRef, useState } from "react";
import { MessageWindowStatus, useSupabase } from "@/pages/supabaseProvider";
import Message from "@/lib/messages/message";

type ConversationProps = {
    user: User // logged in user
    otherUser: User // other person in the conversation
    messages: Message[] // all the messages in the conversation
}

export const Conversation = ({ user, otherUser, messages }: ConversationProps) => {

    const { setStatus, setSelectedUser, supabase, selectedUser } = useSupabase();

    const containerRef = useRef(null);

    // the new message input value
    const [message, setMessage] = useState('');


    useEffect(() => {
        const element: any = containerRef.current; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [messages]);

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
            console.log('error5');
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

    const shouldDisplayReadStatus = (message: Message): boolean => {
        // this method returns true if the message is the last message sent by the current user
        const messagesCopy = [...messages];
        const lastMessage = messagesCopy.reverse().find((m) => m.getSender().getId() === user.getId());
        if (!lastMessage) {
            return false;
        }
        return lastMessage.getId() === message.getId();
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
                                <div className={`${styles.timestamp} ${styles.sender}`}>
                                    {formatTimestamp(message.getCreatedAt())}
                                    {shouldDisplayReadStatus(message) && message.getHasBeenRead() && <><span className="material-symbols-outlined">done_all</span><span>Lu</span></>}
                                </div>
                            </div>

                        </div>
                    )
                }
                // other user has sent the message
                return (
                    <div key={message.getId()} className={styles.message_wrapper}>
                        <div className={styles.message}>
                            <div className={`${styles.message_text} darkSensibleText`}>{message.getMessage()}</div>
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
            <div className={styles.conversation} ref={containerRef}>
                {buildConversation()}
            </div>
            <fieldset role="group">
                <input
                    name="text"
                    type="text"
                    placeholder="Saisir un message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />
                <input type="submit" value="Envoyer" onClick={sendMessage} />
            </fieldset>
        </div >
    );
};

export default Conversation;