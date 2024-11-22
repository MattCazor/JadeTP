import { useRouter } from "next/router";
import { useEffect } from "react"
import { useSupabase } from "./supabaseProvider";
import User from "@/lib/users/user";
import { HomeComponent } from "@/components/home/home";
import { useState } from "react";
import { LoadingScreen } from "@/components/misc/loading/loading-screen";

export default function Home() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [isLoading, setIsLoading] = useState(true); // loading state

  useEffect(() => {
    handleOnPageLoad();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const handleOnPageLoad = async () => {
    // chekc if user is logged in
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user == null || error) {
      // redirect to login
      router.push('/login');
      return;
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
      } else {
        router.push('/login');
      }
    }

    setIsLoading(false);
  };


  return isLoading ? (
    <LoadingScreen />
  ) : (
    <HomeComponent user={user!} />
  )

}