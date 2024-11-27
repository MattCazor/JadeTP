
import styles from './profile-picture.module.css'

export const ProfilePicture = ({ initials }: { initials: string }) => {
    return (
        <div className={styles.initals_wrapper}>
            <div className='darkSensibleText'>{initials}</div>
        </div>
    )
}

export default ProfilePicture;