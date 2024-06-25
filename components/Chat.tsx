"use client";

import { IReactThread } from "@/models/Thread";
import { IReactMessage } from "@/models/Message";
import { IPerson } from "@/models/User";

type IHydratedReactMessage = Omit<IReactMessage, 'sender'> & {
  sender: IPerson | undefined
}


type ChatProps = {
  initThread: IReactThread,
  userId: string
}

export default function Chat({initThread, userId}: ChatProps) {
  
  const messages: IReactMessage[] | IHydratedReactMessage[] = initThread.messages

  const hydratedMessages = messages.map(msg => {
    return ({...msg, 
      sender: initThread.participants.find(p => p._id == msg.sender)
    })

  })

  return (
    <>
      <h1>Chats Component Placeholder</h1>
      <div className="border w-full p-2 content">
        {hydratedMessages.map(hm => {

          const senderIsUser: boolean = hm.sender?._id === userId

          return (
            <div 
              className={`
                border
                w-5/6
                ${senderIsUser ? 
                  "float-right" : 
                  "float-left"
                }`
              }
            >
              <div 
                className={
                  `border 
                  w-auto
                  max-w-full
                  p-1
                  m-1
                  ${senderIsUser ? 
                    "float-right" : 
                    "float-left"
                  }`
                }
              >
                <span>{hm.text}</span>
              </div>

            </div>
          )
        })}
      </div>
    </>
  )
}