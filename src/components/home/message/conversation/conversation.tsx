import ProfilePicture from "@/components/misc/profile-picture";
import User from "@/lib/users/user";
import styles from './conversation.module.css';
import { useEffect, useRef, useState } from "react";
import { MessageWindowStatus, useSupabase } from "@/pages/supabaseProvider";
import Message, { MESSAGE_TYPE } from "@/lib/messages/message";
import GifPicker from "./gif_picker/gif_picker";

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
    // if the user wants to send a GIF
    const [shouldOpenGifPicker, setShouldOpenGifPicker] = useState(false);


    useEffect(() => {
        const element: any = containerRef.current; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (gif = false, content: string) => {
        // this method send a message.
        // if gif is true, the message is a gif
        // if gif is false, the message is a text message
        // content is either the text message or the gif url

        // get the message
        if (content == '' && !gif) {
            alert('Veuillez saisir un message');
            return;
        }

        const { error } = await supabase.from('messages').insert([
            {
                receiver: selectedUser?.getId(),
                sender: user.getId(),
                message: gif ? '' : content,
                read: false,
                msg_type: gif ? MESSAGE_TYPE.GIF : MESSAGE_TYPE.TEXT,
                gif_url: gif ? content : null
            }
        ]);
        if (error) {
            console.log('error5');
            alert(error.message);
            return;
        }
        setMessage('');
        setShouldOpenGifPicker(false);

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

        const displayMessageAccordingToType = (message: Message): React.ReactNode => {
            switch (message.getType()) {
                case MESSAGE_TYPE.TEXT:
                    return <div>{message.getMessage()}</div>
                case MESSAGE_TYPE.GIF:
                    return <img
                        src={message.getGifUrl()}
                        alt="gif"
                        onLoad={() => {
                            // re scroll to the bottom of the conversation
                            const element: any = containerRef.current; // eslint-disable-line @typescript-eslint/no-explicit-any
                            if (element) {
                                element.scrollTop = element.scrollHeight;
                            }
                        }} />
                default:
                    return <div>{message.getMessage()}</div>
            }
        }

        return (
            messages.map((message) => {
                if (message.getSender().getId() === user.getId()) {
                    // logged in user has sent the message
                    return (
                        <div key={message.getId()} className={`${styles.message_wrapper} ${styles.sender_wrapper}`}>
                            <div className={`${styles.message} ${styles.sender}`}>
                                {displayMessageAccordingToType(message)}
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
                            sendMessage(false, message);
                        }
                    }}
                />
                <input type="submit" value="Envoyer" onClick={() => sendMessage(false, message)} />
                <div onClick={() => setShouldOpenGifPicker(true)} className={styles.gifWrapper} >
                    <span className="material-symbols-outlined" style={{ fontSize: '50px' }}>gif_box</span>
                </div>
            </fieldset>
            {/* gif picker */}
            <dialog open={shouldOpenGifPicker}>
                <GifPicker setShouldOpenGifPicker={setShouldOpenGifPicker} sendGif={sendMessage} />
            </dialog>
        </div >
    );
};

export default Conversation;