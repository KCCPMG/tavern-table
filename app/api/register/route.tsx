"use server"

export async function POST(req: Request) {
  console.log(req.body);
  return Response.json({
    data: "hello"
  })
}