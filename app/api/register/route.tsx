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
    return Response.json({ data: user }, {
      status: 201
    });
  } catch(e) {

    // check if this error is a NextError
    if ((e as any).name === NextError.name) {
      const err = e as NextError;
      return new Response(err.message, {
        status: err.status
      })
    }
    // all errors should be NextErrors, if not, send server error
    else return Response.error()
  }
}