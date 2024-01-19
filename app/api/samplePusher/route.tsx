import Pusher from "pusher";


export async function POST(req: Request) {

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_CLUSTER as string,
    useTLS: true,
  });

  
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