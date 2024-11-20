import React from 'react';
import './index.css';
import { supabase } from '../../lib/initSupabase';

export default function Register() {

    const onSubmitRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the browser from reloading the page

        const target = e.target as typeof e.target & {
            firstName: { value: string };
            lastName: { value: string };
            email: { value: string };
            password: { value: string };
        };

        const firstName = target.firstName.value;
        const lastName = target.lastName.value;
        const email = target.email.value;
        const password = target.password.value;

        // try to create a new user
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    firstName: firstName,
                    lastName: lastName
                }
            }
        });

        // check if there is an error
        if (error) {
            alert(error.message);
        } else {
            // the user has been created, continue
            const userId = data.user?.id;
            localStorage.setItem('userId', userId as string);

        }
    };

    return (
        <form onSubmit={onSubmitRegister}>
            <label htmlFor="firstName">Prénom</label>
            <input type="text" placeholder='Prénom' name="firstName" />

            <label htmlFor="lastName">Nom</label>
            <input type="text" placeholder='Nom' name="lastName" />

            <label htmlFor="email">Email</label>
            <input type="email" placeholder='Email' name="email" />

            <label htmlFor="password">Mot de passe</label>
            <input type="password" placeholder='Mot de passe' name="password" />

            <button type="submit">S'inscrire</button>

        </form>
    )
}