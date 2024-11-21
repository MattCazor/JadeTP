'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSupabase } from '../supabaseProvider'
import styles from './index.module.css';
import { ErrorMessage } from '@/components/misc/error-message'
import Link from 'next/link'

export default function Login() {
    const { supabase, appName } = useSupabase();
    const router = useRouter();

    useEffect(() => {
        handleUserAlreadySignedIn();
    }, []);

    const handleUserAlreadySignedIn = async () => {
        // check if user is already logged in and redirect to home page
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user != null && error == null) {
            router.push('/');
        }
    };

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            setError(error.message);
        } else {
            router.push('/');
        }
    }

    return (
        <div className={styles.main_wrapper}>
            <h1>{appName}</h1>
            <div className={styles.form_wrapper}>
                <input name="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} className={styles.input} />
                <input
                    type="password"
                    name="password"
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className={styles.input}
                />
                {error && (
                    <ErrorMessage message={error} />
                )}

                <button onClick={handleSignIn} className={styles.input}>Se connecter</button>
            </div>
            <p>Pas encore de compte ? <Link href='/register'>Créer un compte</Link></p>
        </div>
    )
}