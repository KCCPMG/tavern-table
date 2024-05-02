"use client";
import MainLoggedIn from "./MainLoggedIn";
import MainLoggedOut from "./MainLoggedOut";
import { useSession } from "next-auth/react"

export default async function Main() {
  
  const { data: session, status } = useSession()
  
  return (
    <>
      {session?.user ? 
      <MainLoggedIn username={session.user.username || ""}/> 
      : <MainLoggedOut />}
    </>
  )
}