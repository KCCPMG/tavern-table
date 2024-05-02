

import { getServerSession } from "next-auth/next";
import Main from "@/components/Main";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { revalidatePath } from 'next/cache'
// revalidatePath('/blog/post-1')

export const metadata = {
  title: 'App Router',
}

// export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default async function Page() {

  const resp = await fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=America/Los_Angeles');
  const json = await resp.json();
  const {hour, minute, seconds} = json;

  // revalidatePath('/');
  // const router = useRouter();
  const session = await getServerSession(authOptions);
  // const session = await getSession();

  console.log("From page:", {session});

  return (
    <>
      <Main />
    </>
  )
}

