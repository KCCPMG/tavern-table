import mongoose from 'mongoose';
import { THREAD_CHAT_TYPES, ChatTypes } from './constants';

const THREAD_CHAT_TYPES_ARRAY = Object.values(THREAD_CHAT_TYPES);


/* Interface and Schema Declarations */

// basic interface
export interface IThread {
  _id: mongoose.Types.ObjectId,
  participants: Array<mongoose.Types.ObjectId>,
  chatType: typeof THREAD_CHAT_TYPES_ARRAY[number],
  campaignId?: mongoose.Types.ObjectId,
  name?: string
}

// instance methods
export interface IThreadMethods {
  // stub
}

// create a new model that incorporates IThreadMethods, declare static methods
export interface ThreadModel extends mongoose.Model<IThread, {}, IThreadMethods> {
  findOrCreateThreadId({ threadId, participants, chatType }: findOrCreateThreadIdObj ): Promise<IThread>
}

// main schema
const ThreadSchema = new mongoose.Schema({
  participants: {
    required: true,
    type: [mongoose.Types.ObjectId]
  },
  chatType: {
    type: String,
    required: true,
    enum: Object.values(THREAD_CHAT_TYPES)
  },
  campaignId: {
    required: false,
    type: mongoose.Types.ObjectId
  },
  name: {
    type: String,
    required: false
  }
})


/* Supporting Types and Values */

export type RequiredThreadValues = {
  name: string,
  chatType: ChatTypes,
  participants: Array<mongoose.Types.ObjectId>
}


/* Instance Methods */


/* Static Methods */

type findOrCreateThreadIdObj = {
  threadId?: string,
  participants: Array<string>,
  chatType: typeof THREAD_CHAT_TYPES_ARRAY[number]
}

ThreadSchema.static('findOrCreateThreadId', async function findOrCreateThread(
  { threadId, participants, chatType }: findOrCreateThreadIdObj 
): Promise<string> {

  try {
    if (threadId) return (threadId);

    // else try to find threadId
    const foundThread = await this.findOne({
      $and: [
        { chatType: chatType },
        { participants: { $in: participants } }
      ]
    })
    
    if (foundThread) return (foundThread._id);
    // else
    const newThread = await this.create({
      participants,
      chatType: THREAD_CHAT_TYPES.CHAT
    })
    return newThread._id;

  } catch(err) {
    console.log(err);
    throw err;
  }
})



export default mongoose.models.Thread as ThreadModel || mongoose.model<IThread, ThreadModel>("Thread", ThreadSchema)