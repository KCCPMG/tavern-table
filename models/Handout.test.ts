import mongoose from "mongoose";
import mongooseConnect from "@/lib/mongooseConnect"
import Handout,{ HandoutType } from "./Handout";
import Campaign, { CampaignType } from "./Campaign";
import User, { UserType } from "./User";

import fs from "fs";


const bufImage = Buffer.from(fs.readFileSync('./test_resources/sample.jpg'));

type RequiredUserValues = {
  name: string,
  email: string,
  password: string
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

const newCampaignDetails = {

} as RequiredCampaignValues;

const newHandoutDetails = {

} as RequiredHandoutDetails;


describe("A handout", function() {

  test("can be created", async function() {

  })

  test("can be retrieved", async function() {
    Handout.find()
  })

  test("can be deleted", async function() {
    
  })

  test("will not be retrieved", async function() {
    
  })

})