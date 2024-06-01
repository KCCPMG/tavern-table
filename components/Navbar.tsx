"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react"


type LoggedInPanelProps = {
  username: string
}


function LoggedInPanel({username}: LoggedInPanelProps) {
  return (
    <>
      <Link className="text-white text-2xl px-2" href="/campaigns">
        Campaigns
      </Link>
      <Link className="text-white text-2xl px-2" href={"/"} onClick={(e) => {
        e.preventDefault();
        signOut();
      }}>
        Log Out {username}
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

  return (
    <nav className="bg-black w-full p-2 flex flex-initial justify-between">
      <span className="text-white text-2xl">Navbar</span>
      <div>
        {session?.user ? 
        <LoggedInPanel username={session.user.username!} /> : 
        <LoggedOutPanel />}
      </div>
    </nav>
  )
}