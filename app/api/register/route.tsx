"use server"

import User from "models/User";
import { UsernameTakenErr, EmailTakenErr, NextError } from "@/lib/NextError";
import mongooseConnect from "@/lib/mongooseConnect";

export async function POST(req: Request) {
  await mongooseConnect();
  // console.log("UsernameTakenErr instanceof NextError", UsernameTakenErr instanceof NextError)
  const json = await req.json();
  const { username, email, password } = json;
  try {
    const user = await User.register({
      username,
      email,
      password
    })
    return Response.json({ data: user });
  } catch(e) {
    // console.log(
    //   err.message, 
    //   err.status, 
    //   err == UsernameTakenErr,
    //   err == EmailTakenErr,
    //   err instanceof Error,
    //   err instanceof NextError
    // );
    console.log((e as Error).name, NextError.name);
    if ((e as any).name === NextError.name) {
      const err = e as NextError;
      return new Response(err.message, {
        status: err.status
      })
    }
    else return Response.error()
  }
}