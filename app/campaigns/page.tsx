import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import Campaigns from "@/components/Campaigns";
import { ICampaign } from "@/models/Campaign"; 
import User, { IUser } from "@/models/User";
import mongoose from "mongoose";
import { UserNotFoundErr } from "@/lib/NextError";
import { revalidatePath } from "next/cache";
import { GET } from "@/api/campaigns/route";
import { NextRequest, NextResponse } from "next/server";



/**
 * I need to be able to get data again
 * In a server componnent, I cannot add *any* functionality to
 * for example, a button, without the compiler yelling at me and
 * the page breaking
 * Even looking at swr, it seems as though there may not be any choice 
 * except to move everything to client components.
 * Likely the best I can hope to do is use the server side to retrieve
 * the initial data on the page load as props to pass to the client components
 */



// export function getCampaigns(userId): Array<ICampaign> {
//   Campaign.find()
// }

function getTime() {
  return new Date();
}


async function getUser(userId: mongoose.Types.ObjectId | string): Promise<IUser> {
  console.log(userId);
  const queryResult = await User.findOne({_id: userId});
  console.log({getUser : queryResult});
  if (queryResult) return queryResult;
  else {
    throw UserNotFoundErr;
  }
}

export default async function Page(req: NextRequest, res: NextResponse) {

  const time = getTime();

  
  const serverSession = await getServerSession(authOptions);
  // const user = serverSession?.user._id ? 
  //   await getUser(serverSession?.user._id) :
  //   null;
  // console.log({retrievedUser: user})
  // const campaigns = getCampaigns(serverSession?.user?._id);
  console.log("sanity check");

  if (!(serverSession?.user)) {
    redirect("/");
  }


  // const initCampaignsReq = await fetch(`${process.env.NEXTAUTH_URL}/api/campaigns`);
  const initCampaignsReq = await GET(req, res);
  const initCampaigns = await initCampaignsReq.json();
  

  // else

  return (
    <>
      {/* <p>Server Session: {JSON.stringify(serverSession, null, 2)}</p>
      <p>Username: {serverSession.user.username}</p> */}
      <p>Campaigns go here.</p>
      <Campaigns initialCampaigns={initCampaigns} />
      {/* {campaigns.map(c) => <Link>{campaigns.name}</Link>} */}
      {/* <p>User: {JSON.stringify(user, null, 2)};</p> */}
      <p>{time.toString()}</p>
      {/* <p><button onClick={() => revalidatePath("campaigns/page")}>Refresh</button></p> */}
      {/* <p>{initCampaigns}</p> */}
    </>
  )
}



