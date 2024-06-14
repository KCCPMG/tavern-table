"use client";

import { IReactThread } from "@/models/Thread";

type ThreadsListProps = {
  initThreads: Array<IReactThread>
}


export default function ThreadsList({initThreads}: ThreadsListProps) {



  return (
    <div>
      {JSON.stringify(initThreads)}
    </div>
  )
}