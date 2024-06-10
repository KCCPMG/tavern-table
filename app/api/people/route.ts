import User from "models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('search')

    return Response.json(`You said ${query}`)
    // return Response.json("Test message from api/people - GET")
  } catch(err) {
    return Response.error();
  }
}