"use server";
import Chat from "@/components/Chat";
import Thread from "@/models/Thread";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import ToastRedirect from "@/components/ToastRedirect";


type PageProps = {
  params: {
    id: string
  }
}

export default async function Page({params}: PageProps ) {


  const session = await getServerSession(authOptions);
  console.log({"session.user": session?.user})
  if (!(session?.user._id)) return (
    <ToastRedirect 
      toasts={[
        {
          message: "You must be logged in to do that!",
          status: "error"
        }
      ]}  
      redirect="/"  
    />
  );


  const initThread = await Thread.getThread(params.id, session.user._id);

  return (
    <Chat initThread={initThread} userId={session.user._id}/>
  )

};