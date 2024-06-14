import handleErrorResponse from "@/lib/handleErrorResponse";
import Message from "@/models/Message";
import { NextRequest, NextResponse} from "next/server";
import mongooseConnect from "@/lib/mongooseConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserNotFoundErr, InvalidMessageErr } from "@/lib/NextError";
import { MESSAGE_TYPES, MESSAGE_TYPE_ARR } from "@/models/constants";



export async function POST(req: NextRequest, res: NextResponse) {
  try {

    await mongooseConnect();
    const serverSession = await getServerSession(authOptions);

    if (!(serverSession?.user)) throw UserNotFoundErr;
    if (!(serverSession.user?._id)) throw UserNotFoundErr;

    const json = await req.json();
    const { chatType } = json;

    if (!chatType) throw InvalidMessageErr;
    if (!MESSAGE_TYPE_ARR.includes(chatType)) throw InvalidMessageErr;

    switch (chatType) {
      case MESSAGE_TYPES.TEXT_ONLY:
        const { recipientId, text, threadId } = json;

        const message = await Message.createTextMessage({
          senderId: serverSession.user._id,
          recipientId,
          text,
          threadId: threadId || undefined
        });
        return Response.json(message);

      
        
      
    }


    


  } catch (err) {
    console.log(err);
    return handleErrorResponse(err);
  }
}