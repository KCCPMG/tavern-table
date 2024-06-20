"use client";

import { IReactThread } from "@/models/Thread";
import { useSession } from "next-auth/react";
import Link from "next/link";


type ThreadsListProps = {
  initThreads: Array<IReactThread>,
  userId: string
}


export default function ThreadsList({initThreads, userId}: ThreadsListProps) {



  console.log(initThreads);

  return (
    <ul>
      {initThreads.map( it => {

        const imageUrlArr = []

        if (it.chatType === "CHAT") {
          const otherParticipant = it.participants.filter(pt => pt._id !== userId)[0];
          imageUrlArr.push(otherParticipant.imageUrl);

        } else if (it.chatType === "CAMPAIGN") {
          // get campaign imageUrl
        } else if (it.chatType === "ROOM") {
          const otherParticipants = it.participants.filter(pt => pt._id !== userId);
          otherParticipants.forEach(op => imageUrlArr.push(op.imageUrl));
        }

        console.log(it.chatType);
        console.log(imageUrlArr);

        return (
          <li key={it.threadId}>
            <Link href={`/threads/${it.threadId}`}>
              <h5>{it.name}</h5>
              {it.messages[0] && 
                <>
                  <div>
                    {
                      imageUrlArr.map(url => {
                        return <img key={new Date().toDateString()} src={url} />
                      })
                    }
                  </div>
                  <div>
                    <p>{it.messages[0].text}</p>
                    <p>
                      {new Date(it.messages[0].sendTime).toLocaleString()}
                    </p>
                  </div>
                </>
              }
            </Link>
          </li>
        )
      })}
    </ul>
  )
}