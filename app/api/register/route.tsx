"use server"

import User from "models/User";
import { NextError } from "@/lib/NextError";
import mongooseConnect from "@/lib/mongooseConnect";

export async function POST(req: Request) {
  await mongooseConnect();
  const json = await req.json();
  const { username, email, password } = json;
  try {
    const user = await User.register({
      username,
      email,
      password
    })
    return Response.json({ data: user });
  } catch(err) {
    console.log(err.message, err.status, err instanceof NextError);
    if (err instanceof NextError) {
      return new Response(err.message, {
        status: err.status
      })
    }
    else return Response.error()
  }
}