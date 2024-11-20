import { useRouter } from "next/router";
import { useEffect } from "react"
import { useSupabase } from "./supabaseProvider";

export default function Home() {
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    handleOnPageLoad();
  }, []);

  const handleOnPageLoad = async () => {
    // chekc if user is logged in
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user == null) {
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