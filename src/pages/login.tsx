'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSupabase } from './supabaseProvider'

export default function Login() {
    const { supabase } = useSupabase();
    useEffect(() => {
        handleUserAlreadySignedIn();
        console.log("here");
    }, []);

    const handleUserAlreadySignedIn = async () => {
        // check if user is already logged in and redirect to home page
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user != null) {
            router.push('/');
        }
    };


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSignUp = async () => {
        await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        router.refresh()
    }

    const handleSignIn = async () => {
        await supabase.auth.signInWithPassword({
            email,
            password,
        })
        router.refresh()
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <>
            <input name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <button onClick={handleSignUp}>Sign up</button>
            <button onClick={handleSignIn}>Sign in</button>
            <button onClick={handleSignOut}>Sign out</button>
        </>
    )
}