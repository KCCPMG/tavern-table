import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import Thread, { IThread, RequiredThreadValues } from "./Thread";
import { THREAD_CHAT_TYPES } from "./constants";



const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;

const newChatThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: CHAT
} as RequiredThreadValues;

const newRoomThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: ROOM
} as RequiredThreadValues;

const newCampaignThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: CAMPAIGN
} as RequiredThreadValues;


beforeAll(async function() {
  await mongooseConnect();
  await Thread.deleteMany({name: "test"})
})

afterAll(async function() {
  await Thread.deleteMany({name: "test"})
  await mongoose.disconnect();
})


describe("A thread", function() {

  test("can be created", async function() {

    // make returned ThreadType obj indexable by string
    const [newChatThread, newRoomThread, newCampaignThread]: Array<IThread> = await Promise.all([
      Thread.create(newChatThreadDetails),
      Thread.create(newRoomThreadDetails),
      Thread.create(newCampaignThreadDetails)
    ])

    const indexableNewChatThread: {[index: string]: any} = newChatThread;
    for (let [key, val] of Object.entries(newChatThreadDetails)) {
      expect(indexableNewChatThread).toHaveProperty(key);
      expect(indexableNewChatThread[key]).toBe(val);
    }

    const indexableNewRoomThread: {[index: string]: any} = newRoomThread;
    for (let [key, val] of Object.entries(newRoomThreadDetails)) {
      expect(indexableNewRoomThread).toHaveProperty(key);
      expect(indexableNewRoomThread[key]).toBe(val);
    }

    const indexableNewCampaignThread: {[index: string]: any} = newCampaignThread;
    for (let [key, val] of Object.entries(newCampaignThreadDetails)) {
      expect(indexableNewCampaignThread).toHaveProperty(key);
      expect(indexableNewCampaignThread[key]).toBe(val);
    }

  })

  test("can be retrieved", async function() {
    const foundThreads: {[index: string]: IThread}[] = await Thread.find({name: "test"});
    expect(foundThreads.length).toBe(3);
    foundThreads.forEach(ft => {
      expect(ft).toHaveProperty('name');
      expect(ft.name).toBe('test');
    })
  })

  test("can be deleted", async function() {
    await Thread.deleteMany({name: "test"});
  })

  test("will not be retrieved", async function() {
    const foundThreads: {[index: string]: IThread} [] = await Thread.find({name: "test"});
    expect(foundThreads.length).toBe(0);
  })

})