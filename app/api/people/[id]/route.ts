import { UserNotFoundErr } from "@/lib/NextError";
import User, { IPerson } from "models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params} : {params: {id: string}}) {
  try {
    const person = await User.getPerson(params.id);
    if (!person) throw UserNotFoundErr;
    return Response.json(person);
  } catch(err) {
    return Response.error();
  }
}