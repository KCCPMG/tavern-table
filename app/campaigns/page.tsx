import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import AddCampaignButton from "@/components/AddCampaignButton";
import { ICampaign } from "@/models/Campaign"; 
import User, { IUser } from "@/models/User";
import mongoose from "mongoose";
import { UserNotFoundErr } from "@/lib/NextError";


// export function getCampaigns(userId): Array<ICampaign> {
//   Campaign.find()
// }


async function getUser(userId: mongoose.Types.ObjectId | string): Promise<IUser> {
  console.log(userId);
  const queryResult = await User.findOne({_id: userId});
  console.log({getUser : queryResult});
  if (queryResult) return queryResult;
  else {
    throw UserNotFoundErr;
  }
}

export default async function Campaigns() {

  const serverSession = await getServerSession(authOptions);
  const user = serverSession?.user._id ? 
    await getUser(serverSession?.user._id) :
    null;
  console.log({retrievedUser: user})
  // const campaigns = getCampaigns(serverSession?.user?._id);

  if (!serverSession?.user) {
    redirect("/");
  }

  // else

  return (
    <>
      {/* <p>Server Session: {JSON.stringify(serverSession, null, 2)}</p>
      <p>Username: {serverSession.user.username}</p> */}
      <p><AddCampaignButton /></p>
      <p>Campaigns go here.</p>
      {/* {campaigns.map(c) => <Link>{campaigns.name}</Link>} */}
      <p>User: {JSON.stringify(user, null, 2)};</p>
    </>
  )
}



