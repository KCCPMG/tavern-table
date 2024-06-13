import handleErrorResponse from "@/lib/handleErrorResponse";
import Message from "@/models/Message";
import { NextRequest, NextResponse} from "next/server";
import mongooseConnect from "@/lib/mongooseConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserNotFoundErr } from "@/lib/NextError";



export async function POST(req: NextRequest, res: NextResponse) {
  try {

    await mongooseConnect();
    const serverSession = await getServerSession(authOptions);

    if (!(serverSession?.user)) throw UserNotFoundErr;
    if (!(serverSession.user?._id)) throw UserNotFoundErr;


    const { recipientId, text, threadId } = await req.json();


    const message = await Message.createTextMessage({
      senderId: serverSession.user._id,
      recipientId,
      text,
      threadId: threadId || undefined
    });
    return Response.json(message);
  } catch (err) {
    handleErrorResponse(err);
  }
}