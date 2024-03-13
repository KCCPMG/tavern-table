import { RequiredUserValues } from "../User";
import { RequiredThreadValues } from "../Thread";
import { RequiredCampaignValues } from "../Campaign";
import { THREAD_CHAT_TYPES } from "../constants";


export const sampleUser1Details: RequiredUserValues = {
  username: "sampleUser1",
  email: "sampleUser1@test.com",
  password: "samplepassword"
}

export const sampleUser2Details: RequiredUserValues = {
  username: "sampleUser2",
  email: "sampleUser2@test.com",
  password: "samplepassword"
}

export const sampleCampaignThreadDetails: RequiredThreadValues = {
  name: "test",
  participants: [],
  chatType: THREAD_CHAT_TYPES.CAMPAIGN
}

export const sampleCampaignDetails = {
  name: "Test Campaign",
} as RequiredCampaignValues;