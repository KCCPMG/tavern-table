"use client";

import { IReactThread } from "@/models/Thread";
import { IReactMessage } from "@/models/Message";
import { IPerson } from "@/models/User";
import { MESSAGE_TYPES } from "@/models/constants";

type IHydratedReactMessage = Omit<IReactMessage, 'sender'| 'directRecipient'> & {
  sender: IPerson | undefined,
  directRecipient?: IPerson | undefined
}


type ChatProps = {
  initThread: IReactThread,
  userId: string
}

export default function Chat({initThread, userId}: ChatProps) {
  
  const messages: IReactMessage[] | IHydratedReactMessage[] = initThread.messages;

  console.log({initThread});

  const hydratedMessages: IHydratedReactMessage[] = messages.map(msg => {
    return ({...msg, 
      sender: initThread.participants.find(p => p._id == msg.sender),
      directRecipient: initThread.participants.find(p => p._id == msg.directRecipient),
    })

  })

  console.log({hydratedMessages})

  return (
    <>
      <h1>Chats Component Placeholder</h1>
      <div className="border w-full p-2 content">
        {hydratedMessages.map(hm => <ChatMessage 
          key={hm._id} hm={hm} userId={userId} 
        /> )}
      </div>
    </>
  )
}



type ChatMessageProps = {
  hm: IHydratedReactMessage,
  userId: string
}

function ChatMessage({ hm, userId }: ChatMessageProps ) {
  const senderIsUser: boolean = hm.sender?._id === userId;
  
  const messageIsInvitation: boolean = (
    hm.messageType === MESSAGE_TYPES.CAMPAIGN_INVITE ||
    hm.messageType === MESSAGE_TYPES.ROOM_INVITE
  )

  const senderIsUserStyle = senderIsUser ? 
    "float-right" : "float-left"

  const messageIsInvitationStyle = messageIsInvitation ? 
    "bg-slate-300" : ""

  const messageClassName = [
    'border w-5/6',
    senderIsUserStyle,
    messageIsInvitationStyle
  ].join(" ")


  function generateInvitationSummaryMessage() {
    
    const inviter = (hm.sender!._id === userId) ? 
      "You" : hm.sender!.username;

    const invitee = (hm.directRecipient?._id === userId) ? 
      "you" : hm.directRecipient?.username;

    const campaignOrGroup = hm.messageType === MESSAGE_TYPES.CAMPAIGN_INVITE ? "Campaign" : "Group";

    return inviter + " invited " + invitee + " to join the " + campaignOrGroup
  }
    // const invitationString = messageIsInvitation ?
    //   (hm.sender === userId) ? "You" :  :
    //   ""

  return (

    <div 
      className="w-full block"
    >
      <div 
        className={(senderIsUser ? "justify-end ml-16 " : "justify-start mr-16") + " border p-1 flex my-2"}
      >
        <span>{hm.text}</span>
      </div>

    </div>
  )

}