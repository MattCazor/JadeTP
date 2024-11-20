import { useRouter } from "next/router";
import { useEffect } from "react"
import { supabase } from "../lib/initSupabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    handleOnPageLoad();
  }, []);

  const handleOnPageLoad = async () => {
    // chekc if user is logged in
    const jwt = localStorage.getItem('userId');
    if (jwt) {
      const data = await supabase.auth.getUser();
      console.log(data);
    } else {
      // redirect to login
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-white">Hello GrafBase</h1>
    </div>
  )
}