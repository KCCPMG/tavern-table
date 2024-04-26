"use client";
import User from "types/User";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react"


type LoggedInPanelProps = {
  username: string
}


function LoggedInPanel({username}: LoggedInPanelProps) {

  return (
    <div className="float-right">
      <span className="text-white text-2xl px-2">
        {username}
      </span>
      <span className="text-white text-2xl px-2" onClick={() => {signOut();}}>
        Log Out
      </span>
    </div>
  )
}

function LoggedOutPanel() {
  return (
    <div className="float-right">
      <span className="text-white text-2xl">
        <Link href="/signin">Log In</Link>
      </span>
    </div>
  )
}


type NavbarProps = {
  user? : User
}


export default function Navbar() {

  const { data: session, status } = useSession()
  // console.log("Navbar:", user ? user : "no user");

  return (
    <nav className="bg-black w-full p-2">
      <span className="text-white text-2xl">Navbar</span>
      {session?.user ? <LoggedInPanel username={session.user.username!} /> : <LoggedOutPanel />}
    </nav>
  )
}