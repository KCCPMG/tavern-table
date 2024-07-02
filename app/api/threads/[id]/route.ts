import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { MustSignInErr, ThreadAccessDeniedErr } from "@/lib/NextError";
import handleErrorResponse from "@/lib/handleErrorResponse";
import Thread from "@/models/Thread";


export async function GET(req: NextRequest, {params}: {params: {id: string}}){
  try {

    const session = await getServerSession(authOptions);
    const userId = session?.user._id 
    const threadId = params.id;

    if (!userId) throw MustSignInErr;
  
    try {
      await Thread.getDeeplyPopulatedThread(threadId, userId);
    } catch(err) {
      console.log(err);
    }


    const thread = await Thread.getThread(threadId, userId);

    if ( !(thread.participants.find(p => p._id ===userId)) ) {
      throw ThreadAccessDeniedErr;
    }

    return Response.json(thread);

  } catch(err) {
    return handleErrorResponse(err);  
  }


}