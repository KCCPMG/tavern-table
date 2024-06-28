import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import Campaigns from "@/components/Campaigns";
import { GET } from "@/api/campaigns/route";
import { NextRequest, NextResponse } from "next/server";



export default async function Page(req: NextRequest, res: NextResponse) {

  const serverSession = await getServerSession(authOptions);

  if (!(serverSession?.user)) {
    redirect("/");
  }

  // else
  const initCampaignsReq = await GET(req, res);
  const initCampaigns = await initCampaignsReq.json();
  
  return (
    <>
      <Campaigns initialCampaigns={initCampaigns} />
    </>
  )
}



