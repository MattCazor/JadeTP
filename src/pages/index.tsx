import { useRouter } from "next/router";
import { useEffect } from "react"
import { useSupabase } from "./supabaseProvider";
import User from "@/lib/users/user";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    handleOnPageLoad();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const handleOnPageLoad = async () => {
    // chekc if user is logged in
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user == null) {
      // redirect to login
      router.push('/login');
    }

    // fetch profile from profiles table
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').limit(1).single();
    if (profilesError) {
      alert(profilesError.message);
      return;
    } else {
      if (profiles) {
        const profile = profiles;
        setUser(new User(profile.id, profile.first_name, profile.last_name));
      }
    }


  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-white">Hello {user?.getFullName()}</h1>
      <button onClick={handleSignOut} >Se déconnecter</button>
    </div>
  )
}