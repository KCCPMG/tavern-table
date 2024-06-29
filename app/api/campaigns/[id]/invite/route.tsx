import { NextRequest, NextResponse } from "next/server";
import { inviteToCampaign } from "@/models/Controls";
import handleErrorResponse from "@/lib/handleErrorResponse";


export async function POST(req: NextRequest, res: NextResponse) {

  try {

    const body = await req.json();
    const { userId, inviteeId, campaignId, text } = body;

    const message = await inviteToCampaign({ userId, inviteeId, campaignId, text });

    return Response.json(message);

  } catch(err) {
    handleErrorResponse(err);
  }



}