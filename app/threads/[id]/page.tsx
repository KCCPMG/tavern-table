"use server";
import Chat from "@/components/Chat";
import Thread, { IReactThread } from "@/models/Thread";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import ToastRedirect from "@/components/ToastRedirect";
import Image from "next/image";
import { headers } from "next/headers";
import { GET } from "@/api/threads/[id]/route";
import { NextRequest, NextResponse } from "next/server";

const placeholderImgString = "/sample.jpg";



type PageProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps  ) {

  const session = await getServerSession(authOptions);
  // console.log({"session.user": session?.user})
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

  try {
    // const initThread = await Thread.getThread(params.id, session.user._id);
    const initThreadReq = await fetch(
      process.env.NEXTAUTH_URL + `/api/threads/${params.id}`, {
        headers: headers()
      }
    );

    console.log({
      "request status": initThreadReq.status, 
      "request status text": initThreadReq.statusText
    });

    if (!initThreadReq.ok) {
      throw new Error(initThreadReq.statusText);
    }

    const initThread: IReactThread = await initThreadReq.json()

    // if (!(initThread.participants.find(p => p._id === session.user._id))) {
    //   return (
    //     <ToastRedirect 
    //       toasts={[
    //         {
    //           message: "You do not have permission to view this thread",
    //           status: "error"
    //         }
    //       ]}  
    //       redirect="/messages"  
    //     />
    //   )
    // }


    return (
      <>
        <div>
          <Image 
            src={initThread.imageUrl || placeholderImgString} 
            alt={initThread.name} 
            width="100"
            height="100"
            className="inline-block"
          />
          <div className="inline-block">
            <h1>{initThread.name}</h1>
          </div>
        </div>
        <Chat initThread={initThread} userId={session.user._id}/>
      </>
    )
  } catch (err) {
    console.log(err);
    const error = err as Error;
    return <ToastRedirect redirect="/messages" toasts={[
      {
        message: error!.message || "Something went wrong",
        status: 'error'
      }
    ]} />
  }
  

};