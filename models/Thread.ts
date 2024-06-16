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
    ref: User?.modelName || "User"
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
  ref: Message?.modelName || "Message",
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


  return threads;

})


// ThreadSchema.static('getThreadPreviewsFor', async function getThreadPreviewsFor(userId: string): Promise<Array<IReactThread>> {

//   console.log("updated");

//   const uId = new mongoose.Types.ObjectId(userId);

//   const agg = await this.aggregate([
//     { $match: { participants: uId } },
//     { $unwind: "$participants" },
//     { $match: { participants: { $ne: uId } } },
//     {
//       $lookup: {
//         from: "users",
//         localField: "participants",
//         foreignField: "_id",
//         as: "participantUser"
//       }
//     },
//     { $unwind: "$participantUser" },
//     {
//       $lookup: {
//         from: "messages",
//         let: { threadId: "$_id" },
//         pipeline: [
//           { $match: { $expr: { $in: ["$$threadId", "$threadIds"] } } },
//           { $sort: { sendTime: -1 } },
//           { $limit: 1 },
//           { $project: { text: 1, sendTime: 1, _id: 0 } }
//         ],
//         as: "latestMessage"
//       }
//     },
//     { $sort: { "latestMessage.sendTime": -1 } },
//     { $project: { _id: 1, latestMessage: 1 } }
//   ]);

//   console.log(agg);
//   return(agg);
// });



// ThreadSchema.static('SPIKEgetThreadPreviewsFor', async function SPIKEgetThreadPreviewsFor(userId: string): Promise<Array<IReactThread>> {
//   // get threads
//   const threads: Array<IThread> = await this.find({participants: {$in : userId }})
//   // get messages

//   console.log({threads});
  

//   const loadedThreads = await Promise.all(
//     threads.map(thread => {
//       return (Message.find({ threadIds: thread._id})
//       .sort({ sendTime: -1 })
//       .limit(1)
//       .exec()
//       .then(messages => {
//         return {
//           threadId: thread._id.toString(),
//           name: thread.name || "placeholder",
//           participants: thread.participants.map(p => p.toString()),
//           // messages: messages.map(m => m.toIReactMessage())
//           messages
//         }
//       }))

//     })
//   );

//   loadedThreads.sort((a,b) => {
//     return (a.messages[0].sendTime.valueOf() || 0) - (b.messages[0].sendTime.valueOf() || 0)
//   })

//   loadedThreads.forEach(lt => lt.messages.forEach(m => m.toIReactMessage()));

//   console.log(JSON.stringify(loadedThreads));

//   return loadedThreads;

//   // How do I write a mongoose query where I am looking for the latest Message document to have in its threadIds array the id of a Thread document, for all Threads which include a particular userId in its participants array?

//   // await Message.find({threadIds: 
//   //   {$in: this.find({participants: {$in : userId }})
//   // })

//   // the last message in each thread in which this user is a participant
//   // userId is in thread participants

//   // return {
//   //   threadId: "string",
//   //   name: "string",
//   //   participants: ["string"],
//   //   messages: [await Message.getIReactMessage('asdfgdhgfsfgasd')]
//   // }

//   // export type IReactThread = {
//   //   threadId: string,
//   //   name: string,
//   //   participants: Array<string>,
//   //   messages: Array<IReactMessage>
//   // }
// })


export default mongoose.models.Thread as ThreadModel || mongoose.model<IThread, ThreadModel>("Thread", ThreadSchema)