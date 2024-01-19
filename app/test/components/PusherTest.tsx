"use client"
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function PusherTest() {

  const [pusherData, setPusherData] = useState({})


  // Enable pusher logging - don't include this in production
  // Pusher.logToConsole = true;

  useEffect(() => {

    fetch('/api/samplePusher', {
      method: 'POST',
      body: JSON.stringify({
        message: "hello pusher",
        sender: "its-a me"
      })
    })
    .then(res => res.json())
    .then(json => console.log(json));

    console.log(process.env.PUSHER_KEY, process.env.PUSHER_CLUSTER)

    // const pusher = new Pusher(process.env.PUSHER_KEY as string, {
    //   cluster: process.env.PUSHER_CLUSTER as string
    // });

    const pusher = new Pusher("a1bb6b25bb513f4d5a0a", {
      cluster: "us3"
    });
  
    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function(data: any) {
      const stringified = JSON.stringify(data);
      setPusherData(stringified);
      console.log(stringified);
    });

    return (() => {
      pusher.unsubscribe('my-channel');
    })
  })

  return (
    <h1>
      PusherTest: {JSON.stringify(pusherData)}
    </h1>
  )
}