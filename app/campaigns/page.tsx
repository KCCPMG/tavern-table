import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function Campaigns() {

  const session = await getServerSession(authOptions);
  console.log("From campaigns page:", {session});

  if (!session?.user) {
    redirect("/");
  }

  // else

  return (
    <>
      Campaigns go here.
      <p>Session: {JSON.stringify(session)}</p>
      <p>Username: {session.user.username}</p>
    </>
  )
}