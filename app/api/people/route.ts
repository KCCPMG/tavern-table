import User from "models/User";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const searchParams = req.nextUrl.searchParams;
    const queryString = searchParams.get('search');

    if (!queryString) throw "No input given";

    const re = new RegExp(queryString, "gi");

    const people = await User.find({
      $or: [
        {email: re},
        {username: re}
      ]
    });
    return Response.json(people);

  } catch(err) {
    return Response.error();
  }
}