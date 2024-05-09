import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import AddCampaignButton from "@/components/AddCampaignButton";

export default async function Campaigns() {

  const serverSession = await getServerSession(authOptions);

  if (!serverSession?.user) {
    redirect("/");
  }

  // else

  return (
    <>
      Campaigns go here.
      <p>Server Session: {JSON.stringify(serverSession, null, 2)}</p>
      <p>Username: {serverSession.user.username}</p>
      <AddCampaignButton />

    </>
  )
}



