import styles from './login-spinner.module.css';


type LoadingSpinnerProps = {
    height?: number;
    width?: number;
}
export const LoadingSpinner = ({ height, width }: LoadingSpinnerProps) => {
    const heightAct = height ? height : 150;
    const widthAct = width ? width : 150;

    return (
        <div className={styles.loader} style={{ height: heightAct, width: widthAct }}></div>
    )
}