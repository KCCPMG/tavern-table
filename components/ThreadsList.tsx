"use client";

import { IReactThread } from "@/models/Thread";

type ThreadsListProps = {
  initThreads: Array<IReactThread>
}


export default function ThreadsList({initThreads}: ThreadsListProps) {

  console.log(initThreads);

  return (
    <ul>
      {initThreads.map( it => {
        return (
          <li key={it.threadId}>
            <h5>{it.name}</h5>
          </li>
        )
      })}
    </ul>
  )
}