"use client";

import { IReactThread } from "@/models/Thread";
import { IReactMessage } from "@/models/Message";


type ChatProps = {
  initThread: IReactThread,
  userId: string
}

export default function Chat({initThread, userId}: ChatProps) {
  


  return (
    <h1>Placeholder</h1>
  )
}