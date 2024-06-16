import mongoose from 'mongoose';
import { MESSAGE_TYPE_ARR, THREAD_CHAT_TYPES, ChatTypes } from './constants';
import Message, { IReactMessage } from './Message';
import User, { IPerson } from './User';
import mongooseConnect from '@/lib/mongooseConnect';

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
  findOrCreateThreadId({ threadId, participants, chatType }: findOrCreateThreadIdObj ): Promise<IThread>,
  getThreadsFor(userId: string): Promise<IThread>,
  getThreadPreviewsFor(userId: string): Promise<Array<IReactThread>>
}

type Participant = IPerson & {
  lastRead: Date,
}

export type MessageType = typeof MESSAGE_TYPE_ARR[number];

interface IMessage {
  _id: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId,
  threadIds: Array<mongoose.Types.ObjectId>,
  sendTime: Date,
  messageType: MessageType,
  text?: string,
  response?: {
    messageId: mongoose.Types.ObjectId,
    messageType: MessageType
  }
}

// main schema
const ThreadSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
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


ThreadSchema.virtual('messages', {
  ref: "Message",
  localField: "_id",
  foreignField: "threadIds"
})

ThreadSchema.set('toJSON', {virtuals: true});
ThreadSchema.set('toObject', {virtuals: true});



/* Supporting Types and Values */

export type RequiredThreadValues = {
  name: string,
  chatType: ChatTypes,
  participants: Array<mongoose.Types.ObjectId>
}

export type IReactThread = {
  threadId: string,
  name: string,
  participants: Array<string>,
  messages: Array<IReactMessage>
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
        { participants: { $all: participants } } 
        // need to delete prior threads
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


ThreadSchema.static('getThreadsFor', async function getThreadsFor(userId: string): Promise<IThread> {
  // const threads = await this.find({participants: {$in : [userId] }})
  const threads = await this.find({participants: userId})
  return threads;
})


ThreadSchema.static('getThreadPreviewsFor', async function getThreadPreviewsFor(userId: string): Promise<Array<IReactThread>> {
  await mongooseConnect();
  const threads = await this.find({participants: userId})
  .populate({
    path: 'messages',
    select: 'sender sendTime chatType participants text'
  })
  .populate({
    path: 'participants',
    select: 'username email imageUrl'
  });


  [1,2,3,4].map(num => {
    return num;
  })

  const sanitizedThreads = threads.map(t => {

    const otherParticipant = t.participants.filter(part => part._id.toString() != userId)[0];

    return {
      userId,
      threadId: t._id,
      name: t.name ? t.name : otherParticipant.username,
      otherParticipant,
      // imageUrl: otherParticipant.imageUrl,
      participants: t.participants,
      messages: t.messages
    }
  })

  return sanitizedThreads;

})



export default mongoose.models.Thread as ThreadModel || mongoose.model<IThread, ThreadModel>("Thread", ThreadSchema)