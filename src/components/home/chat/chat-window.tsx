import ProfilePicture from '@/components/misc/profile-picture';
import styles from './chat-window.module.css';
import User from '@/lib/users/user';
import { useRouter } from 'next/router';
import { useSupabase } from '@/pages/supabaseProvider';

type ChatWindowProps = {
    user: User
}

export const ChatWindow = ({ user }: ChatWindowProps) => {
    const router = useRouter();
    const { supabase } = useSupabase();

    const handleSignOut = async () => {
        // to logout the super
        await supabase.auth.signOut();
        router.push('/login');
    };
    return (
        <article className={styles.chat_window}>
            <div className={styles.top_bar}>
                <h1>Messages</h1>
                <div className={styles.icon_button}>
                    <span className="material-symbols-outlined">edit_square</span>
                </div>
            </div>
            <div className='hSep' />
            <div className={styles.messages}>

            </div>
            <div className='hSep' />
            <div className={styles.bottom_profile}>
                <div className={styles.profile}>
                    <ProfilePicture initials={user.getInitials()} />
                    {user.getFullName()}
                </div>
                <div className={styles.icon_button} onClick={handleSignOut}>
                    <span className="material-symbols-outlined">logout</span>
                </div>
            </div>

        </article >
    )
};

export default ChatWindow;