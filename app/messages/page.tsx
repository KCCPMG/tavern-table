import { authOptions } from "@/api/auth/[...nextauth]/route";
import ThreadsList from "@/components/ThreadsList";
import ToastRedirect from "@/components/ToastRedirect";
import { getServerSession } from "next-auth";
import Thread from "models/Thread";
import { GET } from "@/api/messages/route";
import { NextRequest, NextResponse } from "next/server";



export default async function MessagesPage(req: NextRequest, res: NextResponse) {

  const session = await getServerSession(authOptions);

  if (!session?.user._id) return (
    <ToastRedirect
      toasts={[
        {
          message: "You must be logged in to see your messages",
          status: "error"
        }
      ]}
      redirect="/"
    />
  )

  const initThreadsReq = await GET(req, res);
  const initThreads = await initThreadsReq.json();


  return (
    // <div>{JSON.stringify(initThreads)}</div>
    <ThreadsList initThreads={initThreads} userId={session.user._id}/>
  )
}