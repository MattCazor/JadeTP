import styles from './error-message.module.css'

type ErrorMessageProps = {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <div className={styles.error_msg}>
            <span className="material-symbols-outlined">warning</span>
            {message}
        </div>
    )
}