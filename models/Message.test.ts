import mongoose from 'mongoose';
import Thread from "./Thread";
import Message from "./Message";
import { MESSAGE_TYPES, THREAD_CHAT_TYPES } from "./constants";
import User, { UserType } from "./User";
import mongooseConnect from '@/lib/mongooseConnect';


const {
  BEFRIEND_REQUEST,
  BEFRIEND_ACCEPT,
  BEFRIEND_REJECT,
  CAMPAIGN_INVITE,
  CAMPAIGN_INVITE_ACCEPT,
  CAMPAIGN_INVITE_REJECT,
  END_FRIENDSHIP,
  EXIT_CAMPAIGN,
  PROMOTE_TO_DM,
  REMOVE_FROM_CAMPAIGN,
  ROOM_INVITE,
  ROOM_INVITE_ACCEPT,
  ROOM_INVITE_REJECT,
  STEP_DOWN_DM,
  TEXT_ONLY
} = MESSAGE_TYPES;

const MESSAGE_TYPE_ARRAY = [  
  BEFRIEND_REQUEST,
  BEFRIEND_ACCEPT,
  BEFRIEND_REJECT,
  CAMPAIGN_INVITE,
  CAMPAIGN_INVITE_ACCEPT,
  CAMPAIGN_INVITE_REJECT,
  END_FRIENDSHIP,
  EXIT_CAMPAIGN,
  PROMOTE_TO_DM,
  REMOVE_FROM_CAMPAIGN,
  ROOM_INVITE,
  ROOM_INVITE_ACCEPT,
  ROOM_INVITE_REJECT,
  STEP_DOWN_DM,
  TEXT_ONLY
] as const;

type MessageType = typeof MESSAGE_TYPE_ARRAY[number];

const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;
const THREAD_CHAT_TYPES_ARRAY: string[] = [CHAT, ROOM, CAMPAIGN] as const;
type ChatTypes = typeof THREAD_CHAT_TYPES_ARRAY[number]

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
    
    
    const [firstUser, secondUser]= await Promise.all([
      User.create(firstUserDetails),
      User.create(secondUserDetails)
    ]);

    newThreadDetails.participants = [firstUser._id, secondUser._id];
    newMessageDetails.sender = firstUser._id;
    const newThread = await Thread.create(newThreadDetails);
    newMessageDetails.threadIds = [newThread._id];


    const newMessage: {[index: string]: MessageType} = await Message.create(newMessageDetails);

    for (let [key, val] of Object.entries(newMessageDetails)) {
      expect(newMessage).toHaveProperty(key);
      expect(newMessage[key]).toStrictEqual(val);
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