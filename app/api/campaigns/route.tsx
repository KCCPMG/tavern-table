import Campaign from "@/models/Campaign";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";

import { signIn } from "next-auth/react";
import mongooseConnect from '@/lib/mongooseConnect';
import { UserNotFoundErr } from "@/lib/NextError";



// get all campaigns for a user
export async function GET(req: NextRequest, res: NextResponse) {

  try {
    // const session = await getSession();
    // console.log({"session on route": session});

    await mongooseConnect();
    const serverSession = await getServerSession(authOptions);
    // console.log({"server session on route": serverSession});
  
    // console.log({req});
    // console.log({cookies: req.cookies})
    // const token = await getToken({ req });
    // console.log({token});

    if (!(serverSession?.user)) throw UserNotFoundErr;

    // refresh user
    const user = await User.findById(serverSession.user._id);
    if (!user) throw UserNotFoundErr;
    const campaigns = await user.getCampaigns();
    return Response.json(campaigns);

    // const campaignIds = serverSession?.user.campaigns;

    // const campaignPromises = campaignIds?.map(cid => {
    //   return Campaign.findById(cid);
    // }) || [];

    // console.log(campaignPromises);
  
    // // const campaigns = await Promise.all(campaignPromises);

    // return Response.json(campaigns);

  } catch(err) {
    return Response.error();
  }
}

// create new campaign
export async function POST(req: NextRequest, res: NextResponse) {
  try {

    await mongooseConnect();

    const serverSession = await getServerSession(authOptions);

    const { createObj } = await req.json();
    console.log({createObj});
    const campaign = await Campaign.createCampaign({
      ...createObj,
      creatorId: serverSession?.user._id
    });
    console.log({campaign});

    

    return Response.json(campaign);

  } catch(err) {
    console.log(err);
    return Response.error();
  }
}

