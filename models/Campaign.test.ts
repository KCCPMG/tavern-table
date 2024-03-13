import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User, { IUser } from "./User";
import Thread from "./Thread";
import Campaign, { ICampaign } from "./Campaign";
import { THREAD_CHAT_TYPES } from "./constants";
import { sampleUser1Details, sampleCampaignDetails } from "./test_resources/sampleDocs";


const newThreadDetails = {
  name: "test",
  chatType: THREAD_CHAT_TYPES.CAMPAIGN
}

beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    User.deleteMany({username: sampleUser1Details.username}),
    Thread.deleteMany(newThreadDetails)
  ]);
  const [newUser, newThread]: Array<IUser> = await Promise.all([ 
    User.register(sampleUser1Details),
    Thread.create(newThreadDetails)
  ]);
  sampleCampaignDetails.createdBy = newUser._id;
  sampleCampaignDetails.threadId = newThread._id;
  await Campaign.deleteMany(sampleCampaignDetails);
})

afterAll(async function() {
  await Promise.all([
    Campaign.deleteMany(sampleCampaignDetails),
    User.deleteMany({username: sampleUser1Details.username}),
    Thread.deleteMany(newThreadDetails)
  ]);
  mongoose.disconnect();
})


describe("A campaign", function() {

  test("can be created", async function() {

    // make returned UserType obj indexable by string
    const newCampaign: {[index: string]: ICampaign} = await Campaign.create(sampleCampaignDetails);
    
    for (let [key, val] of Object.entries(sampleCampaignDetails)) {
      expect(newCampaign).toHaveProperty(key);
      expect(newCampaign[key]).toBe(val)
    }
  
  })

  test("can be retrieved", async function() {
    const foundCampaigns: {[index: string]: ICampaign}[] = await Campaign.find(sampleCampaignDetails);
    expect(foundCampaigns.length).toBe(1);
    const foundCampaign = foundCampaigns[0];

    for (let [key, val] of Object.entries(sampleCampaignDetails)) {
      expect(foundCampaign).toHaveProperty(key);
      // toStrictEqual instead of toBe to handle threadId (mongoose.Types.ObjectId)
      expect(foundCampaign[key]).toStrictEqual(val)
    }

  })

  test("can be deleted", async function() {
    await Campaign.deleteMany(sampleCampaignDetails);
  })

  test("will not be retrieved", async function() {
    const foundCampaigns: {[index: string]: ICampaign}[] = await Campaign.find(sampleCampaignDetails);
    expect(foundCampaigns.length).toBe(0);
  })


})