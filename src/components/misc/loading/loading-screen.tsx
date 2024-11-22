import styles from './loading-screen.module.css';
import { LoadingSpinner } from './login-spinner';

export const LoadingScreen = () => {
    return (
        <div className={styles.loaderWrapper} >
            <LoadingSpinner />
            <p className={styles.loadingText}>Chargement...</p>
        </div >
    );
};