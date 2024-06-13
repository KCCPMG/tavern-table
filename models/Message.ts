import mongoose from "mongoose";
import Thread from "./Thread";
import { MESSAGE_TYPES, MESSAGE_TYPE_ARR, RESPONSE_MESSAGE_TYPE_ARR, THREAD_CHAT_TYPES } from "./constants";


/* Interface and Schema Declarations */

// basic interface
export interface IMessage {
  _id: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId,
  directRecipient?: mongoose.Types.ObjectId,
  campaignId?: mongoose.Types.ObjectId,
  threadIds: Array<mongoose.Types.ObjectId>,
  sendTime: Date,
  messageType: MessageType,
  text?: string,
  response?: {
    messageId: mongoose.Types.ObjectId,
    messageType: MessageType
  },
  readBy: Array<mongoose.Types.ObjectId>
}

// instance methods
export interface IMessageMethods {
  // stub
}

// create a new model that knows about IMessageMethods, declare static methods
export interface MessageModel extends mongoose.Model<IMessage, {}, IMessageMethods> {
  createTextMessage(
    {senderId, recipientId, text, threadId}: createTextMessageObj
  ): Promise<IMessage>
}

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  directRecipient: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  campaignId: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  threadIds: {
    type: [mongoose.Types.ObjectId],
    required: true
  },
  sendTime: {
    type: Date,
    required: true,
    default: new Date()
  },
  messageType: {
    required: true,
    type: String,
    enum: MESSAGE_TYPE_ARR,
    // default: 'TEXT_ONLY'
  },
  text: {
    type: String,
    required: false
  },
  response: {
    // default: null,
    messageId: {
      type: mongoose.Types.ObjectId
    },
    messageType: {
      type: String,
      enum: RESPONSE_MESSAGE_TYPE_ARR
    }
  },
  readBy: {
    type: [mongoose.Types.ObjectId]
  }
})


/* Supporting Types and Values */

export type IReactMessage = {
  _id: string,
  sender: string,
  directRecipient?: string,
  campaignId?: string,
  threadIds: Array<string>,
  sendTime: Date,
  messageType: MessageType
  text?: string,
  response?: {
    messageId: string,
    messageType: MessageType
  },
  readBy: Array<string>
}

export type MessageType = typeof MESSAGE_TYPE_ARR[number];
export type ResponseMessageType = typeof RESPONSE_MESSAGE_TYPE_ARR[number];

export type RequiredMessageValues = {
  sender: mongoose.Types.ObjectId,
  threadIds: Array<mongoose.Types.ObjectId>,
  messageType: MessageType,
  text: string
}


/* Instance Methods */

// convert an IMessage to an IReactMessage
MessageSchema.method('toIReactMessage', function toIReactMessage(): IReactMessage {
  return {
    _id: this._id.toString(),
    sender: this.sender.toString(),
    directRecipient: this.directRecipient?.toString() || undefined,
    campaignId: this.campaignId?.toString() || undefined,
    threadIds: this.threadIds.map(t => t.toString()),
    sendTime: this.sendTime,
    messageType: this.messageType,
    text: this.text || undefined,
    response: this.response ? {
      messageId: this.response.messageId!.toString(),
      messageType: this.response.messageType as MessageType
    } : undefined,
    readBy: this.readBy.map(r => r.toString())
  }
})


/* Static Methods */

// Retrieve a message as an IReactMessage
MessageSchema.static('getIReactMessage', async function getIReactMessage(id): Promise<IReactMessage> {
  const message = await this.findById(id);
  return message.toIReactMessage();
})


type createTextMessageObj = {
  senderId: string, 
  recipientId: string, 
  text: string, 
  threadId?: string
}

// Create and send a regular text message from one user to another
MessageSchema.static('createTextMessage', async function createTextMessage(
  {senderId, recipientId, text, threadId}: createTextMessageObj
): Promise<IMessage> {

  try {
    const retrievedThreadId = await Thread.findOrCreateThreadId({
      threadId,
      participants: [senderId, recipientId],
      chatType: THREAD_CHAT_TYPES.CHAT
    })

    const message = await this.create({
      sender: senderId,
      directRecipient: recipientId,
      messageType: MESSAGE_TYPES.TEXT_ONLY,
      text,
      threadIds: retrievedThreadId
    })
    return message;

  } catch (err) {
    console.log(err);
    throw err;
  }

})


/* Default Export and/or modeling of Message */
export default mongoose.models.Message as MessageModel || mongoose.model<IMessage, MessageModel>("Message", MessageSchema);