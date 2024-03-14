import mongoose from 'mongoose';
import Thread, { RequiredThreadValues } from "./Thread";
import Message, { IMessage, RequiredMessageValues } from "./Message";
import { MESSAGE_TYPES, THREAD_CHAT_TYPES, ChatTypes } from "./constants";
import User, { IUser } from "./User";
import mongooseConnect from '@/lib/mongooseConnect';
import { sampleUser1Details, sampleUser2Details } from "./test_resources/sampleDocs";


const newThreadDetails = {
  chatType: THREAD_CHAT_TYPES.CHAT,
  name: "test-chat"
} as RequiredThreadValues;

const newMessageDetails = {
  messageType: MESSAGE_TYPES.TEXT_ONLY,
  text: "hello, this is a chat message"
} as RequiredMessageValues;


beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    User.deleteMany({username: sampleUser1Details.username}),
    User.deleteMany({username: sampleUser2Details.username}),
    Thread.deleteMany(newThreadDetails),
    Message.deleteMany(newMessageDetails)
  ]);
})

afterAll(async function() {
  await Promise.all([
    User.deleteMany({username: sampleUser1Details.username}),
    User.deleteMany({username: sampleUser2Details.username}),
    Thread.deleteMany(newThreadDetails),
    Message.deleteMany(newMessageDetails)
  ]);
  mongoose.disconnect();
})



describe("A message", function(){
  
  test("can be created", async function() {
    
    const [firstUser, secondUser]: Array<IUser> = await Promise.all([
      User.register(sampleUser1Details),
      User.register(sampleUser2Details)
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