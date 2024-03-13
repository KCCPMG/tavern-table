import mongoose from "mongoose";
import mongooseConnect from "@/lib/mongooseConnect"
import Handout,{ IHandout, RequiredHandoutValues } from "./Handout";
import Campaign, { ICampaign } from "./Campaign";
import User, { IUser, RequiredUserValues } from "./User";
import Thread, { IThread, RequiredThreadValues } from "./Thread";
import { THREAD_CHAT_TYPES, ChatTypes } from "./constants";
import { sampleUser1Details } from "./test_resources/sampleDocs";

import fs from "fs";

const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;
const THREAD_CHAT_TYPES_ARRAY: string[] = [CHAT, ROOM, CAMPAIGN] as const;

const bufImage: Buffer = Buffer.from(fs.readFileSync('models/test_resources/sample.jpg'));


type RequiredCampaignValues = {
  name: string,
  threadId: mongoose.Types.ObjectId,
  createdBy?: mongoose.Types.ObjectId
}


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
    User.deleteMany({username: sampleUser1Details.username}),
    Thread.deleteMany(newThreadDetails),
    Campaign.deleteMany(newCampaignDetails),
    Handout.deleteMany(newHandoutDetails)
  ])
  mongoose.disconnect();
})


describe("A handout", function() {

  test("can be created", async function() {
    const newUser: IUser = await User.register(sampleUser1Details);

    newThreadDetails.participants.push(newUser._id);
    const newThread: IThread = await Thread.create(newThreadDetails);

    newCampaignDetails.createdBy = newUser._id;
    newCampaignDetails.threadId = newThread._id;
    const newCampaign: ICampaign = await Campaign.create(newCampaignDetails);

    newHandoutDetails.campaignId = newCampaign._id;
    newHandoutDetails.createdBy = newUser._id;
    const newHandout: IHandout = await Handout.create(newHandoutDetails);

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
    const foundHandouts: Array<IHandout> = await Handout.find(newHandoutDetails);

    expect(foundHandouts.length).toBe(1);
    const newHandout: IHandout = foundHandouts[0];

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
    const foundHandouts: Array<IHandout> = await Handout.find(newHandoutDetails);

    expect(foundHandouts.length).toBe(0);
  })

})