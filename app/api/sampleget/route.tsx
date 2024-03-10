"use server"

export async function GET() {
  return Response.json({data: "hello world"});
  // return Response.json({}, {
  //   status: 400,
  //   statusText: "YOU FUCKED *UP*"
  // });
}