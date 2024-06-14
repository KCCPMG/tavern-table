import { authOptions } from "@/api/auth/[...nextauth]/route";
import ThreadsList from "@/components/ThreadsList";
import ToastRedirect from "@/components/ToastRedirect";
import { getServerSession } from "next-auth";


export default async function MessagesPage() {

  const session = await getServerSession(authOptions);

  if (!session?.user._id) return (
    <ToastRedirect
      toasts={[
        {
          message: "You must be logged in to do that",
          status: "error"
        }
      ]}
      redirect="/"
    />
  )

  // const initThreads = await Thread.getThredPreviewsFor();

  return (
    <ThreadsList initThreads={[]}></ThreadsList>
  )
}