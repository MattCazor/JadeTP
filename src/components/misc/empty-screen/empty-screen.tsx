import styles from './empty-screen.module.css';

type EmptyScreenProps = {
    message: string
    icon: string
}

export const EmptyScreen = ({ message, icon }: EmptyScreenProps) => {
    return (
        <div className={styles.empty_messages}>
            <span className="material-symbols-outlined">{icon}</span>
            <div>{message}</div>
        </div>
    )
};

export default EmptyScreen;