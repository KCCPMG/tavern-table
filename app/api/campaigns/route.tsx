import Campaign from "@/models/Campaign";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";

import mongooseConnect from '@/lib/mongooseConnect';
import { UserNotFoundErr } from "@/lib/NextError";



// get all campaigns for a user
export async function GET(req: NextRequest, res: NextResponse) {

  try {

    await mongooseConnect();
    const serverSession = await getServerSession(authOptions);

    if (!(serverSession?.user)) throw UserNotFoundErr;

    // refresh user
    const user = await User.findById(serverSession.user._id);
    if (!user) throw UserNotFoundErr;
    const campaigns = await user.getCampaigns();
    return Response.json(campaigns);


  } catch(err) {
    return Response.error();
  }
}

// create new campaign
export async function POST(req: NextRequest, res: NextResponse) {
  try {

    await mongooseConnect();

    const serverSession = await getServerSession(authOptions);

    if (!(serverSession?.user)) throw UserNotFoundErr;

    const { createObj } = await req.json();
    // console.log({createObj});
    await Campaign.createCampaign({
      ...createObj,
      creatorId: serverSession?.user._id
    });
    
    // refresh user
    const user = await User.findById(serverSession.user._id);
    if (!user) throw UserNotFoundErr;
    const campaigns = await user.getCampaigns();
    return Response.json(campaigns);

  } catch(err) {
    console.log(err);
    return Response.error();
  }
}

