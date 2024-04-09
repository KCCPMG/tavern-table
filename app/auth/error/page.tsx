"use server";

import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { useSession } from "next-auth/react";

export default async function AuthErrorPage({
  params,
  searchParams,
  request,
  response
}: {
  params: {slug: string};
  searchParams?: { [key: string]: string | string[] | undefined };
  request: NextRequest;
  response: NextResponse;
}) {

  // const params = useParams();
  // const session = useSession();
  // console.log({session});

  let redirectUrl: string;
  // response.headers.flash="googlyboogly"

  return (
    <>
      Test
    </>
    // redirect(redirectUrl)
  )
}