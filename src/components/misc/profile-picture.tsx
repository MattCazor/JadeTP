
import styles from './profile-picture.module.css'

export const ProfilePicture = ({ initials }: { initials: string }) => {
    return (
        <div className={styles.initals_wrapper}>
            {initials}
        </div>
    )
}

export default ProfilePicture;