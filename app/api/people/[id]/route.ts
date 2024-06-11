import { NextError, UserNotFoundErr } from "@/lib/NextError";
import mongooseConnect from "@/lib/mongooseConnect";
import User, { IPerson } from "models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params} : {params: {id: string}}) {
  try {
    const person = await User.getPerson(params.id); // throws UserNotFoundErr if no user
    return Response.json(person);
  } catch(err) {

    // console.log(err instanceof UserNotFoundErr);

    if (err?.constructor.name === "NextError") {
      const error = err as NextError;
      return new Response(error.message, {
        status: error.status,
        statusText: error.message
      })
    } else return Response.error();

  }
}