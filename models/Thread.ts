import mongoose from 'mongoose';
import { MESSAGE_TYPE_ARR, THREAD_CHAT_TYPES, ChatTypes } from './constants';
import Message, { IMessage, IMessageMethods, IReactMessage, MessageModel } from './Message';
import User, { IPerson } from './User';
import mongooseConnect from '@/lib/mongooseConnect';
import { ThreadNotFoundErr, ThreadAccessDeniedErr } from '@/lib/NextError';

const THREAD_CHAT_TYPES_ARRAY = Object.values(THREAD_CHAT_TYPES);


/* Interface and Schema Declarations */

// basic interface
export interface IThread {
  _id: mongoose.Types.ObjectId,
  participants: [{
    lastRead: Date,
    user: mongoose.Types.ObjectId
  }],
  imageUrl?: string,
  chatType: typeof THREAD_CHAT_TYPES_ARRAY[number],
  campaign?: mongoose.Types.ObjectId,
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
  getThreadPreviewsFor(userId: string): Promise<Array<IReactThread>>,
  getThread(threadId: string, userId: string): Promise<IReactThread>
}


export type MessageType = typeof MESSAGE_TYPE_ARR[number];


// main schema
const ThreadSchema = new mongoose.Schema<IThread, ThreadModel, IThreadMethods>({
  participants: [{
    _id: false,
    lastRead: {
      type: Date,
      default: null
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  }],
  chatType: {
    type: String,
    required: true,
    enum: Object.values(THREAD_CHAT_TYPES)
  },
  // campaign: {
  //   required: false,
  //   type: mongoose.Types.ObjectId,
  //   ref: "Campaign"
  // },
  name: {
    type: String,
    required: false
  }
})

// back reference
ThreadSchema.virtual('messages', {
  ref: "Message",
  localField: "_id",
  foreignField: "threadIds"
})

ThreadSchema.virtual('campaign', {
  ref: "Campaign",
  localField: "_id",
  foreignField: "threadId"
})

ThreadSchema.set('toJSON', {virtuals: true});
ThreadSchema.set('toObject', {virtuals: true});



/* Supporting Types and Values */

export type RequiredThreadValues = {
  name: string,
  chatType: ChatTypes,
  participants: {
    lastRead: Date | null,
    user: mongoose.Types.ObjectId
  }[]
}

export type IReactThread = {
  threadId: string,
  name: string,
  imageUrl: string,
  chatType: ChatTypes,
  participants: Array<IPerson>,
  messages: Array<IReactMessage>
}

// Use 'Omit' to override 'participants' key from IThread interface
export type IPopulatedThread = Omit<IThread, 'participants'> & {
  participants: [{
    lastRead: Date,
    user : {
      _id: mongoose.Types.ObjectId,
      username: string,
      email: string,
      imageUrl: string 
    }
  }],
  messages: [IMessage & IMessageMethods],
  campaign: {
    name: string,
    imageUrl: string
  }[]
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
        { 'participants.user' : { $all: participants } } 
        // need to delete prior threads
      ]
    })
    
    if (foundThread) return (foundThread._id.toString());
    // else

    const participantArr = participants.map(participant => {
      return ({user: participant});
    })

    const newThread = await this.create({
      participants: participantArr,
      chatType: THREAD_CHAT_TYPES.CHAT
    })
    return newThread._id.toString();

  } catch(err) {
    console.log(err);
    throw err;
  }
})


ThreadSchema.static('getThreadsFor', async function getThreadsFor(userId: string): Promise<Array<IThread>> {
  // const threads = await this.find({participants: {$in : [userId] }})
  const threads = await this.find({participants: userId})
  return threads;
})


function getImageUrl(thread: IPopulatedThread, userId: string): string { 

  console.log("\ngetImageUrl:\n", thread);

  if (thread.imageUrl) return thread.imageUrl;
  else if (thread.chatType === "CHAT") {
    const otherParticipants = thread.participants.filter(part => part.user._id.toString() != userId);
    const otherParticipant = otherParticipants[0];
    return otherParticipant.user.imageUrl;
  } 
  // else if (thread.chatType === "ROOM") {

  // } 
  else if (thread.chatType === "CAMPAIGN") {
    if (thread.campaign[0]) return thread.campaign[0].imageUrl;
  }
  // else
  return "./sample.jpg";
  
}

ThreadSchema.static('getThreadPreviewsFor', async function getThreadPreviewsFor(userId: string): Promise<Array<IReactThread>> {
  await mongooseConnect();

  console.log(userId);

  const threads: IPopulatedThread[] = await this.find({'participants.user' : userId})
  .populate({
    path: 'messages',
    select: 'sender sendTime chatType participants text'
  })
  .populate({
    path: 'participants.user',
    select: 'username email imageUrl createTime confirmed'
  })
  .populate({
    path: 'campaign',
    select: 'name imageUrl'
  });



  const sanitizedThreads: IReactThread[] = threads.map(t => {

    const otherParticipants = t.participants.filter(part => part.user._id.toString() != userId);
    const otherParticipant = otherParticipants[0];

    const imageUrl = getImageUrl(t, userId);
    console.log({imageUrl});

    return {
      userId,
      threadId: t._id.toString(),
      name: t.name ? t.name : otherParticipant.user.username,
      otherParticipant,
      chatType: t.chatType,
      imageUrl: getImageUrl(t, userId),
      participants: t.participants.map(participant => {
        return {
          _id: participant.user._id.toString(),
          username: participant.user.username,
          email: participant.user.email,
          imageUrl: participant.user.imageUrl
        }
      }),
      messages: t.messages.map(message => {
        // convert necessary fields
        const sanitizedMessage: IReactMessage =  {
          _id: message._id.toString(),
          sender: message.sender.toString(),
          // directRecipient: message.directRecipient?.toString() || undefined,
          threadIds: message.threadIds.map(tId => tId.toString()),
          sendTime: message.sendTime,
          messageType: message.messageType,
          text: message.text,
        }
        // convert optional fields
        if (message.directRecipient) {
          sanitizedMessage.directRecipient = message.directRecipient.toString()
        }
        if (message.campaignId) {
          sanitizedMessage.directRecipient = message.campaignId.toString()
        }
        // message.response is an object, even if undefined will return truthy
        if (message.response?.messageId) {
          sanitizedMessage.response = {
            messageId: message.response.messageId.toString(),
            messageType: message.response.messageType
          }
        }

        return sanitizedMessage;
      })
    }
  })

  return sanitizedThreads;
})


ThreadSchema.static('getThread', async function getThread(threadId: string, userId: string): Promise<IReactThread> {
  try {
    const thread: IPopulatedThread | null = await this.findById(threadId)
    .populate({
      path: 'messages',
      select: 'sender sendTime chatType participants text'
    })
    .populate({
      path: 'participants.user',
      select: 'username email imageUrl createTime confirmed'
    })
    .populate({
      path: 'campaign',
      select: 'name imageUrl'
    });

    if (!thread) throw ThreadNotFoundErr;
    if (!(thread.participants.map(t => t.user._id.toString()).includes(userId))) throw ThreadAccessDeniedErr;

    const otherParticipants = thread.participants.filter(part => part.user._id.toString() != userId);
    const otherParticipant = otherParticipants[0];
  
    thread.messages.sort((a,b) => {
      return new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime()
    });

    const imageUrl = getImageUrl(thread, userId);

    return {
      threadId: thread._id.toString(),
      name: thread.name ? thread.name : otherParticipant.user.username,
      chatType: thread.chatType,
      imageUrl: imageUrl,
      participants: thread.participants.map(participant => {
        return {
          _id: participant.user._id.toString(),
          username: participant.user.username,
          email: participant.user.email,
          imageUrl: participant.user.imageUrl
        }
      }),
      messages: thread.messages.map(message => {

        // convert necessary fields
        const sanitizedMessage: IReactMessage =  {
          _id: message._id.toString(),
          sender: message.sender.toString(),
          threadIds: message.threadIds.map(tId => tId.toString()),
          sendTime: message.sendTime,
          messageType: message.messageType,
          text: message.text,
        }
        // convert optional fields
        if (message.directRecipient) {
          sanitizedMessage.directRecipient = message.directRecipient.toString()
        }
        if (message.campaignId) {
          sanitizedMessage.directRecipient = message.campaignId.toString()
        }
        // message.response is an object, even if undefined will return truthy
        if (message.response?.messageId) {
          sanitizedMessage.response = {
            messageId: message.response.messageId.toString(),
            messageType: message.response.messageType
          }
        }

        return sanitizedMessage;
      })
    }


  } catch(err) {
    throw err;
  }
})



export default mongoose.models.Thread as ThreadModel || mongoose.model<IThread, ThreadModel>("Thread", ThreadSchema)