"use server"
import mongooseConnect from "@/lib/mongooseConnect";

export default async function MongooseTest() {

  const returnedMongoose = await mongooseConnect();

  return (
    <h1>
      Mongoose Test: {JSON.stringify(Object.keys(returnedMongoose))}
    </h1>
  )
}