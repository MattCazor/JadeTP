import { useRouter } from "next/router";
import { useEffect } from "react"

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    handleOnPageLoad();
  }, []);

  const handleOnPageLoad = () => {
    // chekc if user is logged in
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // TO DO
      // check first jwt is still valid
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