import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User, { IUser } from "./User";
import Thread, { IThread } from "./Thread";
import Campaign, { ICampaign } from "./Campaign";
import { THREAD_CHAT_TYPES } from "./constants";
import { sampleUser1Details, sampleCampaignDetails } from "./test_resources/sampleDocs";
import { createCampaign } from "./Controls";


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
  const [newUser, newThread] = await Promise.all([ 
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

    // make returned Campaign obj indexable by string
    const newCampaign: {[index: string]: any} = await Campaign.create(sampleCampaignDetails);

    
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


  test("can be created with the Controls - createCampaign method", async function() {

    // create user, check correct initializiation
    const sampleUser = await User.findOne({email: sampleUser1Details.email}) as IUser;
    expect(sampleUser).not.toBe(null);

    // create campaign
    const newCampaign: {[index: string]: any} = await createCampaign({
      creatorId: sampleUser._id,
      name: sampleCampaignDetails.name
    });

    expect(newCampaign.name).toBe(sampleCampaignDetails.name);
    expect(newCampaign.createdBy).toBe(sampleUser._id);
    expect(newCampaign.description).toBe(null);
    expect(newCampaign.dm instanceof Array).toBe(true);
    expect(newCampaign.dm.length).toBe(1);
    expect(newCampaign.dm[0]._id.toString()).toBe(sampleUser._id.toString());
    expect(newCampaign.game).toBe(null);
    expect(newCampaign.invitedPlayers).toEqual([]);

    // check that campaign is in user's campaigns
    const sampleUserAfter = await User.findById(newCampaign.createdBy);
    expect(sampleUserAfter!.campaigns).toStrictEqual([newCampaign._id]);
    
    // check thread
    const campaignThread: IThread = await Thread.findOne({_id: newCampaign.threadId}) as IThread;

    console.log({
      "sampledUser._id": sampleUser._id,
      "received Participants": campaignThread.participants
    })
    expect(campaignThread.participants instanceof Array).toBe(true);
    expect(campaignThread.participants).toHaveLength(1);
    expect(campaignThread.participants[0].lastRead).toBeNull();
    expect(campaignThread.participants[0].user).toEqual(sampleUser._id);
    // expect(campaignThread.participants).toEqual([{
    //   lastRead: null,
    //   user: sampleUser._id}
    // ])
    expect(campaignThread.chatType).toBe(THREAD_CHAT_TYPES.CAMPAIGN)
    expect(campaignThread.participants)

    // delete campaign, check deletion
    await Campaign.deleteMany({_id: newCampaign._id});
    const checkDeleted = await Campaign.find({_id: newCampaign._id});
    expect(checkDeleted.length).toBe(0);

    // delete thread, check deletion
    await Thread.deleteMany({_id: campaignThread._id});
    const checkDeletedThread = await Thread.find({_id: campaignThread._id});
    expect(checkDeletedThread.length).toBe(0);
  })

})