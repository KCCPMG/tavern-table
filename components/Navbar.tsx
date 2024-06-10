"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react"




function LoggedInPanel() {
  return (
    <>
      <Link className="text-white text-2xl px-2" href="/campaigns">
        Campaigns
      </Link>
      <Link className="text-white text-2xl px-2" href={"/"} onClick={(e) => {
        e.preventDefault();
        signOut();
      }}>
        Log Out
      </Link>
    </>
  )
}

function LoggedOutPanel() {
  return (
    <>
      <span className="text-white text-2xl">
        <Link href="/signin">Log In</Link>
      </span>
    </>
  )
}


export default function Navbar() {
  const { data: session } = useSession()
  

  const imageUrl = (session?.user?.imageUrl?.length && session?.user?.imageUrl?.length > 0) ? 
    session.user.imageUrl : 
    "https://dd7tel2830j4w.cloudfront.net/f1512860094165x267422131728380920/T.png";

  return (
    <nav className="bg-black w-full p-2 flex flex-initial justify-between">
      <span className="text-white text-2xl">
        {session?.user && 
          <img className="h-8 w-8 mr-2 inline-block"  src={imageUrl} />
        }
        Tavern Table {session?.user && `- ${session.user.username}`}
      </span>
      <div>
        {session?.user ? 
        <LoggedInPanel /> : 
        <LoggedOutPanel />}
      </div>
    </nav>
  )
}