import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User, { RequiredUserValues, IUser } from "./User";
import Thread from "./Thread";
import Campaign, { ICampaign } from "./Campaign";
import { THREAD_CHAT_TYPES } from "./constants";

type RequiredCampaignValues = {
  name: string,
  threadId: mongoose.Types.ObjectId,
  createdBy?: mongoose.Types.ObjectId
}

const newCampaignDetails = {
  name: "Test Campaign",
} as RequiredCampaignValues;

const newUserDetails: RequiredUserValues = {  
  name: "testUser",
  email: "testUser@aol.com",
  password: "testPassword"
};

const newThreadDetails = {
  name: "test",
  chatType: THREAD_CHAT_TYPES.CAMPAIGN
}

beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    User.deleteMany(newUserDetails),
    Thread.deleteMany(newThreadDetails)
  ]);
  const [newUser, newThread]: Array<IUser> = await Promise.all([ 
    User.register(newUserDetails),
    Thread.create(newThreadDetails)
  ]);
  newCampaignDetails.createdBy = newUser._id;
  newCampaignDetails.threadId = newThread._id;
  await Campaign.deleteMany(newCampaignDetails);
})

afterAll(async function() {
  await Promise.all([
    Campaign.deleteMany(newCampaignDetails),
    User.deleteMany(newUserDetails),
    Thread.deleteMany(newThreadDetails)
  ]);
  mongoose.disconnect();
})


describe("A campaign", function() {

  test("can be created", async function() {

    // make returned UserType obj indexable by string
    const newCampaign: {[index: string]: ICampaign} = await Campaign.create(newCampaignDetails);
    
    for (let [key, val] of Object.entries(newCampaignDetails)) {
      expect(newCampaign).toHaveProperty(key);
      expect(newCampaign[key]).toBe(val)
    }
  
  })

  test("can be retrieved", async function() {
    const foundCampaigns: {[index: string]: ICampaign}[] = await Campaign.find(newCampaignDetails);
    expect(foundCampaigns.length).toBe(1);
    const foundCampaign = foundCampaigns[0];

    for (let [key, val] of Object.entries(newCampaignDetails)) {
      expect(foundCampaign).toHaveProperty(key);
      // toStrictEqual instead of toBe to handle threadId (mongoose.Types.ObjectId)
      expect(foundCampaign[key]).toStrictEqual(val)
    }

  })

  test("can be deleted", async function() {
    await Campaign.deleteMany(newCampaignDetails);
  })

  test("will not be retrieved", async function() {
    const foundCampaigns: {[index: string]: ICampaign}[] = await Campaign.find(newCampaignDetails);
    expect(foundCampaigns.length).toBe(0);
  })


})