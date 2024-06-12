import mongoose from "mongoose";
import { MESSAGE_TYPES } from "./constants";

const MESSAGE_TYPE_ARR = Object.values(MESSAGE_TYPES);


export interface IMessage {
  _id: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId,
  directRecipient?: mongoose.Types.ObjectId,
  campaignId?: mongoose.Types.ObjectId,
  threadIds: Array<mongoose.Types.ObjectId>,
  sendTime: Date,
  messageType: typeof MESSAGE_TYPE_ARR[number],
  text?: string,
  response?: {
    messageId: mongoose.Types.ObjectId,
    messageType: typeof MESSAGE_TYPE_ARR[number]
  },
  readBy: Array<mongoose.Types.ObjectId>
}

export type IReactMessage = {
  _id: string,
  sender: string,
  directRecipient?: string,
  campaignId?: string,
  threadIds: Array<string>,
  sendTime: Date,
  messageType: typeof MESSAGE_TYPE_ARR[number],
  text?: string,
  response?: {
    messageId: string,
    messageType: typeof MESSAGE_TYPE_ARR[number]
  },
  readBy: Array<string>
}

export type MessageType = typeof MESSAGE_TYPE_ARR[number];

export type RequiredMessageValues = {
  sender: mongoose.Types.ObjectId,
  threadIds: Array<mongoose.Types.ObjectId>,
  messageType: MessageType,
  text: string
}

export interface IMessageMethods {
  // stub
}

// create a new model that knows about IMessageMethods
export interface MessageModel extends mongoose.Model<IMessage, {}, IMessageMethods> {

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
      enum: ["BEFRIEND_ACCEPT", "BEFRIEND_REJECT", "CAMPAIGN_INVITE_ACCEPT", "CAMPAIGN_INVITE_REJECT", "ROOM_INVITE_ACCEPT", "ROOM_INVITE_REJECT"]
    }
  },
  readBy: {
    type: [mongoose.Types.ObjectId]
  }
})

export interface IMessageMethods {
  // stub
}

// create a new model that knows about IMessageMethods
export interface MessageModel extends mongoose.Model<IMessage, {}, IMessageMethods> {

}

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
      messageType: this.response.messageType as typeof MESSAGE_TYPE_ARR[number]
    } : undefined,
    readBy: this.readBy.map(r => r.toString())
  }
})

export default mongoose.models.Message as MessageModel || mongoose.model<IMessage, MessageModel>("Message", MessageSchema);