import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import Thread, {ThreadType} from "./Thread";
import { THREAD_CHAT_TYPES } from "./constants";


const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;
const THREAD_CHAT_TYPES_ARRAY: string[] = [CHAT, ROOM, CAMPAIGN] as const;


type ChatTypes = typeof THREAD_CHAT_TYPES_ARRAY[number]

type RequiredThreadValues = {
  name: string,
  chatType: ChatTypes
}

const newChatThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: CHAT
}

const newRoomThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: ROOM
}

const newCampaignThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: CAMPAIGN
}


beforeAll(async function() {
  await mongooseConnect();
  await Thread.deleteMany({name: "test"})
})

afterAll(async function() {
  await mongoose.disconnect();
})


describe("A thread", function() {

  test("can be created", async function() {

    // make returned ThreadType obj indexable by string
    const [newChatThread, newRoomThread, newCampaignThread] = await Promise.all([
      Thread.create(newChatThreadDetails),
      Thread.create(newRoomThreadDetails),
      Thread.create(newCampaignThreadDetails)
    ])

    for (let [key, val] of Object.entries(newChatThreadDetails)) {
      expect(newChatThread).toHaveProperty(key);
      expect(newChatThread[key]).toBe(val);
    }

    for (let [key, val] of Object.entries(newRoomThreadDetails)) {
      expect(newRoomThread).toHaveProperty(key);
      expect(newRoomThread[key]).toBe(val);
    }

    for (let [key, val] of Object.entries(newCampaignThreadDetails)) {
      expect(newCampaignThread).toHaveProperty(key);
      expect(newCampaignThread[key]).toBe(val);
    }

  })

  test("can be retrieved", async function() {
    const foundThreads: {[index: string]: ThreadType}[] = await Thread.find({name: "test"});
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
    const foundThreads: {[index: string]: ThreadType} [] = await Thread.find({name: "test"});
    expect(foundThreads.length).toBe(0);
  })

})