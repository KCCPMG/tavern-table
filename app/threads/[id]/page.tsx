"use server";
import Chat from "@/components/Chat";
import Thread, { IReactThread } from "@/models/Thread";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import ToastRedirect from "@/components/ToastRedirect";
import Image from "next/image";

const placeholderImgString = "/sample.jpg";



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
    <>
      <span>
        <Image 
          src={initThread.imageUrl || placeholderImgString} 
          alt={initThread.name} 
          width="150"
          height="150"
        />
        {/* <img src={initThread.imageUrl || placeholderImgString} alt={initThread.name} /> */}
        <h1>{initThread.name}</h1>
      </span>
      <Chat initThread={initThread} userId={session.user._id}/>
    </>
  )

};