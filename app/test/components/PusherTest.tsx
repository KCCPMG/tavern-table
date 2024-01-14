"use client"
import { useEffect, useState } from "react";
// import { pusherClient } from "@/lib/pusher";

export default function PusherTest() {

  const [pusherData, setPusherData] = useState({})

  useEffect(() => {
    fetch('/api/samplePusher', {
      method: 'POST',
      body: JSON.stringify({
        message: "hello pusher",
        sender: "its-a me"
      })
    })
    .then(res => res.json())
    .then(json => setPusherData(json));
  }, [])

  // Enable pusher logging - don't include this in production
  // Pusher.logToConsole = true;

  // var pusher = new Pusher('a1bb6b25bb513f4d5a0a', {
  //   cluster: process.env.PUSHER_CLUSTER
  // });

  // var channel = pusher.subscribe('my-channel');
  // channel.bind('my-event', function(data) {
  //   alert(JSON.stringify(data));
  // });

  return (
    <h1>
      PusherTest: {JSON.stringify(pusherData)}
    </h1>
  )
}