import { NextRequest, NextResponse } from "next/server";
import { inviteToCampaign } from "@/models/Controls";
import { getServerSession } from "next-auth";
import handleErrorResponse from "@/lib/handleErrorResponse";
import { MustSignInErr } from "@/lib/NextError";
import { authOptions } from "@/api/auth/[...nextauth]/route";


export async function GET() {
  return Response.json("pissssss");
}

export async function POST(req: NextRequest, 
  {params}: {params: {id: string}}, res: NextResponse
) {

  try {

    const session = await getServerSession(authOptions);
    const userId = session?.user._id 

    const campaignId = params.id;

    if (!userId) throw MustSignInErr;

    const body = await req.json();
    const { inviteeId, text } = body;

    const message = await inviteToCampaign({ userId, inviteeId, campaignId, text });

    return Response.json(message);

  } catch(err) {
    console.log(err);
    return handleErrorResponse(err);
  }



}