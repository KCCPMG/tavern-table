import mongoose from 'mongoose';
import Thread from "./Thread";
import Message, { IMessage } from "./Message";
import { MESSAGE_TYPES, THREAD_CHAT_TYPES } from "./constants";
import User, { IUser } from "./User";
import mongooseConnect from '@/lib/mongooseConnect';


const MESSAGE_TYPE_ARRAY = Object.values(MESSAGE_TYPES);


const { TEXT_ONLY } = MESSAGE_TYPES;
const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;
const THREAD_CHAT_TYPES_ARRAY: string[] = [CHAT, ROOM, CAMPAIGN] as const;

type ChatTypes = typeof THREAD_CHAT_TYPES_ARRAY[number]
type MessageType = typeof MESSAGE_TYPE_ARRAY[number];

type RequiredUserValues = {
  name: string,
  email: string,
  password: string
}

type RequiredThreadValues = {
  name: string,
  chatType: ChatTypes,
  participants: Array<mongoose.Types.ObjectId>
}

type RequiredMessageValues = {
  sender: mongoose.Types.ObjectId,
  threadIds: Array<mongoose.Types.ObjectId>,
  messageType: MessageType,
  text: string
}

const firstUserDetails: RequiredUserValues = {  
  name: "testUser1",
  email: "testUser@aol.com",
  password: "testPassword"
};

const secondUserDetails: RequiredUserValues = {
  name: "testUser2",
  email: "testUser@aol.com",
  password: "testPassword"
}

const newThreadDetails = {
  chatType: CHAT,
  name: "test-chat"
} as RequiredThreadValues;

const newMessageDetails = {
  messageType: TEXT_ONLY,
  text: "hello, this is a chat message"
} as RequiredMessageValues;


beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    User.deleteMany(firstUserDetails),
    User.deleteMany(secondUserDetails),
    Thread.deleteMany(newThreadDetails),
    Message.deleteMany(newMessageDetails)
  ]);
})

afterAll(async function() {
  await Promise.all([
    User.deleteMany(firstUserDetails),
    User.deleteMany(secondUserDetails),
    Thread.deleteMany(newThreadDetails),
    Message.deleteMany(newMessageDetails)
  ]);
  mongoose.disconnect();
})



describe("A message", function(){
  
  test("can be created", async function() {
    
    const [firstUser, secondUser]: Array<IUser> = await Promise.all([
      User.register(firstUserDetails),
      User.register(secondUserDetails)
    ]);

    newThreadDetails.participants = [firstUser._id, secondUser._id];
    newMessageDetails.sender = firstUser._id;
    const newThread = await Thread.create(newThreadDetails);
    newMessageDetails.threadIds = [newThread._id];


    const newMessage: IMessage = await Message.create(newMessageDetails);

    const indexableMessage: {[index: string]: any} = newMessage;

    for (let [key, val] of Object.entries(newMessageDetails)) {
      expect(indexableMessage).toHaveProperty(key);
      expect(indexableMessage[key]).toStrictEqual(val);
    }
  })

  test("can be retrieved", async function() {
    const foundMessages = await Message.find(newMessageDetails);
    expect(foundMessages.length).toBe(1);
    const newMessage = foundMessages[0];
    for (let [key, val] of Object.entries(newMessageDetails)) {
      expect(newMessage).toHaveProperty(key);
      expect(newMessage[key]).toStrictEqual(val);
    }
  })

  test("can be deleted", async function() {
    await Message.deleteMany(newMessageDetails);
  })

  test("will not be retrieved", async function() {
    const foundMessages = await Message.find(newMessageDetails);
    expect(foundMessages.length).toBe(0);
  })

})