import mongoose from "mongoose";
import mongooseConnect from "@/lib/mongooseConnect"
import Handout,{ HandoutType } from "./Handout";
import Campaign, { CampaignType } from "./Campaign";
import User, { UserType } from "./User";
import Thread, { ThreadType } from "./Thread";
import { THREAD_CHAT_TYPES } from "./constants";

import fs from "fs";

const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;
const THREAD_CHAT_TYPES_ARRAY: string[] = [CHAT, ROOM, CAMPAIGN] as const;

type ChatTypes = typeof THREAD_CHAT_TYPES_ARRAY[number]

const bufImage: Buffer = Buffer.from(fs.readFileSync('models/test_resources/sample.jpg'));


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

type RequiredCampaignValues = {
  name: string,
  threadId: mongoose.Types.ObjectId,
  createdBy?: mongoose.Types.ObjectId
}

type RequiredHandoutValues = {
  createdBy: mongoose.Types.ObjectId,
  campaignId: mongoose.Types.ObjectId,
  handoutTitle: string,
  image: Buffer
}

const newUserDetails: RequiredUserValues = {  
  name: "testUser",
  email: "testUser@aol.com",
  password: "testPassword"
};

const newThreadDetails: RequiredThreadValues = {
  name: "test",
  chatType: CAMPAIGN,
  participants: []
}

const newCampaignDetails = {
  name: "Test Campaign",
} as RequiredCampaignValues;

const newHandoutDetails = {
  handoutTitle: "Test Handout",
  image: bufImage
} as RequiredHandoutValues;

beforeAll(async function() {
  await mongooseConnect();

})


afterAll(async function() {
  await Promise.all([
    User.deleteMany(newUserDetails),
    Thread.deleteMany(newThreadDetails),
    Campaign.deleteMany(newCampaignDetails),
    Handout.deleteMany(newHandoutDetails)
  ])
  mongoose.disconnect();
})


describe("A handout", function() {

  test("can be created", async function() {
    const newUser: UserType = await User.create(newUserDetails);

    newThreadDetails.participants.push(newUser._id);
    const newThread: ThreadType = await Thread.create(newThreadDetails);

    newCampaignDetails.createdBy = newUser._id;
    newCampaignDetails.threadId = newThread._id;
    const newCampaign: CampaignType = await Campaign.create(newCampaignDetails);

    newHandoutDetails.campaignId = newCampaign._id;
    newHandoutDetails.createdBy = newUser._id;
    const newHandout: HandoutType = await Handout.create(newHandoutDetails);

    expect(newHandout.image.equals(bufImage)).toBe(true);

    const indexableHandout: {[index: string]: any} = newHandout;

    for (let [key, val] of Object.entries(newHandoutDetails)) {
      if (key!=="image") { 
        expect(newHandout).toHaveProperty(key);
        expect(indexableHandout[key]).toStrictEqual(val);
      }
    }
  })

  test("can be retrieved", async function() {
    const foundHandouts: Array<HandoutType> = await Handout.find(newHandoutDetails);

    expect(foundHandouts.length).toBe(1);
    const newHandout: HandoutType = foundHandouts[0];

    expect(newHandout.image.equals(bufImage)).toBe(true);

    const indexableHandout: {[index: string]: any} = newHandout;

    for (let [key, val] of Object.entries(newHandoutDetails)) {
      if (key!=="image") { 
        expect(newHandout).toHaveProperty(key);
        expect(indexableHandout[key]).toStrictEqual(val);
      }
    }
  })

  test("can be deleted", async function() {
    await Handout.deleteMany(newHandoutDetails);
  })

  test("will not be retrieved", async function() {
    const foundHandouts: Array<HandoutType> = await Handout.find(newHandoutDetails);

    expect(foundHandouts.length).toBe(0);
  })

})