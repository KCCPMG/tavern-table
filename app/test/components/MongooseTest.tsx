"use server"
import mongooseConnect from "@/lib/mongooseConnect";
import User from "@/models/User";
import Campaign from "@/models/Campaign";

export default async function MongooseTest() {

  await mongooseConnect();

  const users = await User.find({});;
  const campaigns = await Campaign.find({});
  

  return (
    <>
      <br />
      <h2 className="text-2xl font-bold">
        Mongoose Test:  
      </h2> 
      <br />
      Users: {JSON.stringify(users)}
      <br />
      Campaigns: {JSON.stringify(campaigns)};

    </>
  )
}