import mongoose from "mongoose";
import { MESSAGE_TYPES } from "./constants";

const MESSAGE_TYPE_ARR = Object.values(MESSAGE_TYPES);

const Message = new mongoose.Schema({
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

export type MessageType = mongoose.InferSchemaType<typeof Message> & {
  _id: mongoose.Types.ObjectId
};

export default mongoose.models.Message || mongoose.model("Message", Message);