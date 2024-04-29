

import { getServerSession } from "next-auth/next";
import MainLoggedIn from "@/components/MainLoggedIn";
import MainLoggedOut from "@/components/MainLoggedOut";

export const metadata = {
  title: 'App Router',
}

export default async function Page() {

  const session = await getServerSession();

  console.log("From page:", {session});

  return (
    <>
      <h1>Test</h1>
      {session?.user ? 
        <MainLoggedIn username={session.user.username || ""} /> 
        :  <MainLoggedOut />}
    </>
  )
}
