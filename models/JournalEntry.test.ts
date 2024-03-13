import mongoose from "mongoose";
import Campaign, { ICampaign, RequiredCampaignValues } from "./Campaign";
import User, { IUser } from "./User";
import Thread, { IThread } from "./Thread";
import JournalEntry, { IJournalEntry, RequiredJournalEntryValues } from "./JournalEntry";
import mongooseConnect from "@/lib/mongooseConnect";
import { sampleUser1Details, sampleCampaignThreadDetails, sampleCampaignDetails } from "./test_resources/sampleDocs";


const newJournalEntryDetails = {

} as RequiredJournalEntryValues

beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    User.deleteMany({username: sampleUser1Details.username}),
    Campaign.deleteMany(sampleCampaignDetails),
    Thread.deleteMany(sampleCampaignThreadDetails),
    JournalEntry.deleteMany(newJournalEntryDetails)
  ]);
})

afterAll(async function() {
  await Promise.all([
    User.deleteMany({username: sampleUser1Details.username}),
    Campaign.deleteMany(sampleCampaignDetails),
    Thread.deleteMany(sampleCampaignThreadDetails),
    JournalEntry.deleteMany(newJournalEntryDetails)
  ]);
  await mongoose.disconnect();
})


describe("A JournalEntry", function() {

  test("can be created", async function() {
    const newUser: IUser = await User.register(sampleUser1Details);
    sampleCampaignThreadDetails.participants.push(newUser._id);
    const newThread: IThread = await Thread.create(sampleCampaignThreadDetails);
    sampleCampaignDetails.createdBy = newUser._id;
    sampleCampaignDetails.threadId = newThread._id;
    const newCampaign: ICampaign = await Campaign.create(sampleCampaignDetails);
    newJournalEntryDetails.campaignId = newCampaign._id;
    newJournalEntryDetails.createdBy = newUser._id;

    const newJournalEntry: {[index: string]: IJournalEntry} = await JournalEntry.create(newJournalEntryDetails);

    for (let [key, val] of Object.entries(newJournalEntryDetails)) {
      expect(newJournalEntry).toHaveProperty(key);
      expect(newJournalEntry[key]).toStrictEqual(val);
    }
  })

  test("can be retrieved", async function() {

    const journalEntries: Array<{[index: string]: IJournalEntry}> = await JournalEntry.find(newJournalEntryDetails);
    expect(journalEntries.length).toBe(1);

    const newJournalEntry = journalEntries[0];

    for (let [key, val] of Object.entries(newJournalEntryDetails)) {
      expect(newJournalEntry).toHaveProperty(key);
      expect(newJournalEntry[key]).toStrictEqual(val);
    }
  })

  test("can be deleted", async function() {
    await JournalEntry.deleteMany(newJournalEntryDetails);
  })

  test("will not be retrieved", async function() {
    const journalEntries = await JournalEntry.find(newJournalEntryDetails);
    expect(journalEntries.length).toBe(0);
  })

})