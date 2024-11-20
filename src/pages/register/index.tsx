import React, { useEffect, useState } from 'react';
import './index.css';
import { useRouter } from 'next/router';
import { useSupabase } from '../supabaseProvider';
import { ErrorMessage } from '@/components/misc/error-message';

export default function Register() {
    const router = useRouter();
    const { supabase, appName } = useSupabase();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        handleUserAlreadySignedIn();
    }, []);

    const handleUserAlreadySignedIn = async () => {
        // check if user is already logged in and redirect to home page
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user != null) {
            router.push('/');
        }
    };

    const handleSignUp = async () => {


        // try to create a new user
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName
                }
            }
        });

        if (data.user && data.user.identities && data.user.identities.length == 0) {
            // the user already exists (but incorrect password entered)
            setError('Un utilisateur avec cet email existe déjà');
            return;
        } else if (error) {
            setError(error.message);
            return;
        }

        // if the user is created successfully, redirect to home page
        if (data) {
            router.push('/');
        }
    };

    return (
        <div className='main_wrapper'>
            <h1>{appName}</h1>
            <div className='form_wrapper'>
                <div className='field'>
                    <input type="text" placeholder='Prénom' name="firstName" onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className='field'>
                    <input type="text" placeholder='Nom' name="lastName" onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className='field'>
                    <input type="email" placeholder='Email' name="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='field'>
                    <input type="password" placeholder='Mot de passe' name="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && (
                    <ErrorMessage message={error} />
                )}
                <button onClick={handleSignUp}>S'inscrire</button>

            </div>
            <p>Déjà un compte ? <a href='/login'>Se connecter</a></p>

        </div>
    )
}