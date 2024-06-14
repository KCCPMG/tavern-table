import mongoose from 'mongoose';
import { THREAD_CHAT_TYPES, ChatTypes } from './constants';
import Message, { IReactMessage } from './Message';

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
  // get threads
  const threads: Array<IThread> = await this.find({participants: {$in : userId }})
  // get messages

  console.log({threads});
  

  const loadedThreads = await Promise.all(
    threads.map(thread => {
      return (Message.find({ threadIds: thread._id})
      .sort({ sendTime: -1 })
      .limit(1)
      .exec()
      .then(messages => {
        return {
          threadId: thread._id.toString(),
          name: thread.name || "placeholder",
          participants: thread.participants.map(p => p.toString()),
          messages: messages.map(m => m.toIReactMessage())
        }
      }))

      // .then(message: IMessage => {
      //   const reactMessage = message.toIReactMessage();
      // })
    })
  );

  console.log(loadedThreads);

  return loadedThreads;

  // How do I write a mongoose query where I am looking for the latest Message document to have in its threadIds array the id of a Thread document, for all Threads which include a particular userId in its participants array?

  // await Message.find({threadIds: 
  //   {$in: this.find({participants: {$in : userId }})
  // })

  // the last message in each thread in which this user is a participant
  // userId is in thread participants

  // return {
  //   threadId: "string",
  //   name: "string",
  //   participants: ["string"],
  //   messages: [await Message.getIReactMessage('asdfgdhgfsfgasd')]
  // }

  // export type IReactThread = {
  //   threadId: string,
  //   name: string,
  //   participants: Array<string>,
  //   messages: Array<IReactMessage>
  // }
})


export default mongoose.models.Thread as ThreadModel || mongoose.model<IThread, ThreadModel>("Thread", ThreadSchema)