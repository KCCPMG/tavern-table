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


const testStorage = {
  firstUserId: undefined as string | undefined,
  secondUserId: undefined as string | undefined,
  threadId: undefined as string | undefined
}


describe("A message", function(){
  
  test("can be created", async function() {
    
    const [firstUser, secondUser]: Array<IUser> = await Promise.all([
      User.register(sampleUser1Details),
      User.register(sampleUser2Details)
    ]);

    testStorage.firstUserId = firstUser._id.toString();
    testStorage.secondUserId = secondUser._id.toString();

    newThreadDetails.participants = [
      {
        lastRead: null,
        user: firstUser._id,
      },
      {
        lastRead: null,
        user: secondUser._id
      } 
    ];
    newMessageDetails.sender = firstUser._id;
    const newThread = await Thread.create(newThreadDetails);
    testStorage.threadId = newThread._id.toString();
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
    const newMessage: IMessage = foundMessages[0];
    const indexableNewMessage = newMessage as {[index: string]: any}
    for (let [key, val] of Object.entries(newMessageDetails)) {
      expect(indexableNewMessage).toHaveProperty(key);
      expect(indexableNewMessage[key] ).toStrictEqual(val);
    }
  })

  test("can be deleted", async function() {
    await Message.deleteMany(newMessageDetails);
  })

  test("will not be retrieved", async function() {
    const foundMessages = await Message.find(newMessageDetails);
    expect(foundMessages.length).toBe(0);
  })


  test("can be created with createTextMessage method with provided, existent thread", async function() {
    const message = await Message.createTextMessage({
      senderId: testStorage.firstUserId as string,
      recipientId: testStorage.secondUserId as string,
      threadId: testStorage.threadId,
      text: "hello"
    })

    expect(message.sender.toString()).toBe(testStorage.firstUserId);
    expect(message.directRecipient?.toString()).toBe(testStorage.secondUserId);
    expect(message.threadIds.length).toBe(1);
    expect(message.threadIds[0]!.toString()).toBe(testStorage.threadId);
    expect(message.text).toBe("hello");
  })

  test("can be created with createTextMessage method without provided thread", async function() {
    const message = await Message.createTextMessage({
      senderId: testStorage.firstUserId as string,
      recipientId: testStorage.secondUserId as string,
      text: "hello, this is my next message"
    })

    expect(message.sender.toString()).toBe(testStorage.firstUserId);
    expect(message.directRecipient?.toString()).toBe(testStorage.secondUserId);
    expect(message.threadIds.length).toBe(1);
    expect(message.threadIds[0]!.toString()).toBe(testStorage.threadId);
    expect(message.text).toBe("hello, this is my next message");
  })

  test("can be created with createTextMessage method without provided or existent thread", async function() {
    // delete thread, confirm deletion
    await Thread.deleteOne({_id: testStorage.threadId});
    const foundThread = await Thread.findById(testStorage.threadId);
    expect(foundThread).toBeNull();

    const message = await Message.createTextMessage({
      senderId: testStorage.firstUserId as string,
      recipientId: testStorage.secondUserId as string,
      text: "hello, this is my next message"
    })

    expect(message.sender.toString()).toBe(testStorage.firstUserId);
    expect(message.directRecipient?.toString()).toBe(testStorage.secondUserId);
    expect(message.threadIds.length).toBe(1);
    expect(message.threadIds[0]!.toString()).not.toBe(testStorage.threadId);
    expect(message.text).toBe("hello, this is my next message");
  })

})