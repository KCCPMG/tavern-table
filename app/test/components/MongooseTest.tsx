"use server"
import mongooseConnect from "@/lib/mongooseConnect";
import User from "@/models/User";

export default async function MongooseTest() {

  await mongooseConnect();
  const users = await User.find({});;
  

  return (
    <h1>
      Mongoose Test: {JSON.stringify(users)}
    </h1>
  )
}