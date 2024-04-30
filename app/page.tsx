

import { getServerSession } from "next-auth/next";
import MainLoggedIn from "@/components/MainLoggedIn";
import MainLoggedOut from "@/components/MainLoggedOut";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";



export const metadata = {
  title: 'App Router',
}


export default async function Page() 
  {

  const session = await getServerSession(authOptions);
  // const session = await getSession();

  console.log("From page:", {session});

  return (
    <>
      <h1>Test</h1>
      {session?.user ? 
        <MainLoggedIn username={session?.user?.username || "" }/> 
        :  <MainLoggedOut />}
    </>
  )
}

