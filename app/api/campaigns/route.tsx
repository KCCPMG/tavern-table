import Campaign from "@/models/Campaign";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";


// get all campaigns for a user
export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  console.log({"session on route": session});
  const serverSession = await getServerSession(authOptions);
  console.log({"server session on route": serverSession});

  // console.log({req});
  // console.log({cookies: req.cookies})
  const token = await getToken({ req });
  console.log({token});

  return Response.json("hello skippy");
}

// create new campaign
export async function POST(req: NextRequest, res: NextResponse) {
  try {

    console.log({req})

    // const createObj = req?.body?.createObj
    // const campaign = await Campaign.createCampaign({
    //   creatorId: mongoose.Types.ObjectId,
    //   name: string,
    //   description?: string,
    //   game?: string,
    //   invitedPlayers?: Array<mongoose.Types.ObjectId>
    // })

    return Response.json("successful post");

  } catch(err) {
    return Response.error();
  }
}

