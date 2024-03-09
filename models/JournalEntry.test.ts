import mongoose from "mongoose";
import Campaign, { ICampaign } from "./Campaign";
import User, { IUser, RequiredUserValues} from "./User";
import Thread, { IThread } from "./Thread";
import JournalEntry, { IJournalEntry } from "./JournalEntry";
import mongooseConnect from "@/lib/mongooseConnect";
import { THREAD_CHAT_TYPES } from "./constants";

const { CHAT, ROOM, CAMPAIGN } = THREAD_CHAT_TYPES;
const THREAD_CHAT_TYPES_ARRAY: string[] = [CHAT, ROOM, CAMPAIGN] as const;

type ChatTypes = typeof THREAD_CHAT_TYPES_ARRAY[number]

type RequiredCampaignValues = {
  name: string,
  threadId: mongoose.Types.ObjectId,
  createdBy?: mongoose.Types.ObjectId
}

type RequiredThreadValues = {
  name: string,
  chatType: ChatTypes,
  participants: Array<mongoose.Types.ObjectId>
}

type RequiredJournalEntryValues = {
  campaignId: mongoose.Types.ObjectId,
  createdBy: mongoose.Types.ObjectId
}

const newUserDetails: RequiredUserValues = {  
  name: "testUser",
  email: "testUser@aol.com",
  password: "testPassword"
};

const newCampaignDetails = {
  name: "Test Campaign",
} as RequiredCampaignValues;

const newThreadDetails: RequiredThreadValues = {
  name: "test",
  participants: [],
  chatType: THREAD_CHAT_TYPES.CAMPAIGN
}

const newJournalEntryDetails = {

} as RequiredJournalEntryValues

beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    User.deleteMany(newUserDetails),
    Campaign.deleteMany(newCampaignDetails),
    Thread.deleteMany(newThreadDetails),
    JournalEntry.deleteMany(newJournalEntryDetails)
  ]);
})

afterAll(async function() {
  await Promise.all([
    User.deleteMany(newUserDetails),
    Campaign.deleteMany(newCampaignDetails),
    Thread.deleteMany(newThreadDetails),
    JournalEntry.deleteMany(newJournalEntryDetails)
  ]);
  await mongoose.disconnect();
})


describe("A JournalEntry", function() {

  test("can be created", async function() {
    const newUser: IUser = await User.register(newUserDetails);
    newThreadDetails.participants.push(newUser._id);
    const newThread: IThread = await Thread.create(newThreadDetails);
    newCampaignDetails.createdBy = newUser._id;
    newCampaignDetails.threadId = newThread._id;
    const newCampaign: ICampaign = await Campaign.create(newCampaignDetails);
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