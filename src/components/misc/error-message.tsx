import './error-message.css';

type ErrorMessageProps = {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <div className="error_msg">
            <span className="material-symbols-outlined">warning</span>
            {message}
        </div>
    )
}