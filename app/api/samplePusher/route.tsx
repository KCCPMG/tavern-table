import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_API_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "",
  useTLS: true,
});

export async function POST(req: Request) {
  const { message, sender } = await req.json();

  // const json = await req.json();
  console.log({message, sender});
  // console.log({message, sender});

  // console.log(pusher);

  const response = await pusher.trigger("chat", "chat-event", {
    message,
    sender
  });

  return Response.json({ message: "completed" });
}