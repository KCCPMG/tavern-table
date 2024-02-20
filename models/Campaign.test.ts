import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from 'mongoose';
import User from "./User";
import Campaign, { CampaignType } from "./Campaign";

type RequiredCampaignValues = {
  name: string,
  createdBy?: mongoose.Types.ObjectId

}

const newCampaignDetails: RequiredCampaignValues = {
  name: "Test Campaign"
}


const newUserDetails = {  
  name: "testUser",
  email: "testUser@aol.com",
  password: "testPassword"
};

beforeAll(async function() {
  await mongooseConnect();
  await Promise.all([
    Campaign.deleteMany(newCampaignDetails),
    User.deleteMany(newUserDetails)
  ]);
  const newUser = await User.create(newUserDetails);
  newCampaignDetails.createdBy = newUser._id;
  await Campaign.create(newCampaignDetails);
})

afterAll(async function() {
  await Promise.all([
    Campaign.deleteMany(newCampaignDetails),
    User.deleteMany(newUserDetails)
  ]);
  mongoose.disconnect();
})


describe("A campaign", function() {

  test("can be created", async function() {

    // make returned UserType obj indexable by string
    const newCampaign: {[index: string]: CampaignType} = await Campaign.create(newCampaignDetails);
    
    for (let [key, val] of Object.entries(newCampaignDetails)) {
      expect(newCampaign).toHaveProperty(key);
      expect(newCampaign[key]).toBe(val)
    }
  
  })

  test("can be retrieved", async function() {
    const foundCampaigns: {[index: string]: CampaignType}[] = await Campaign.find(newCampaignDetails);
    expect(foundCampaigns.length).toBe(1);
    const foundCampaign = foundCampaigns[0];

    for (let [key, val] of Object.entries(newCampaignDetails)) {
      expect(foundCampaign).toHaveProperty(key);
      expect(foundCampaign[key]).toBe(val)
    }

  })

  test("can be deleted", async function() {
    await Campaign.deleteMany(newCampaignDetails);
  })

  test("will not be retrieved", async function() {
    const foundCampaigns: {[index: string]: CampaignType}[] = await Campaign.find(newCampaignDetails);
    expect(foundCampaigns.length).toBe(0);
  })


})