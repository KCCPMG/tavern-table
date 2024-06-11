import handleErrorResponse from "@/lib/handleErrorResponse";
import User from "models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params} : {params: {id: string}}) {
  try {
    const person = await User.getPerson(params.id); // throws UserNotFoundErr if no user
    return Response.json(person);
  } catch(err) {
    return handleErrorResponse(err);
  }
}