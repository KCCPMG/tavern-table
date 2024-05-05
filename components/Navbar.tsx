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
      <span className="text-white text-2xl px-2">
        {username}
      </span>
      <span className="text-white text-2xl px-2" onClick={() => {signOut();}}>
        Log Out
      </span>
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