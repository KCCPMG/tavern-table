import mongoose from "mongoose";

import User, { IUser } from "@/models/User";
// import Campaign from "@/models//Campaign";
import Thread from "@/models/Thread";
import { DEFAULT_IMAGES } from "@/models/constants";
import dotenv from "dotenv";


async function run() {
  
  // mongoose setup
  dotenv.config({path: ".env.local"});
  // console.log("process.env", process.env);


  // may need to turn off all imports of mongooseConnect in imported files
  const MONGODB_URI = process.env.MONGODB_URI!;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
  console.log("Connected to mongoose");

  // script
  const thread = await Thread.findById("66710008b0e8ba321ecc28fd")
  // .populate({
  //   path: 'messages',
  //   select: 'sender sendTime messageType chatType participants text directRecipient',
  //   // populate: {
  //   //   path: 'threads',
  //   //   populate: {
  //   //     path: 'campaigns'
  //   //   }
  //   // }
  // })
  .populate({
    path: 'participants.user',
    select: 'username email imageUrl createTime confirmed'
  })
  .populate({
    path: 'campaign',
    select: 'name imageUrl'
  });

  // const thread = await Thread.getThread("66710008b0e8ba321ecc28fd", "66218e77a64b5f14d174b637");

  console.log(JSON.stringify(thread, null, 2));


  // const campaigns = await Campaign.find({imageUrl: "localhost:3000/sample.jpg"});
  // console.log(campaigns);
  // const campaignPromises = campaigns.map(campaign => new Promise<void>( async (res, rej) => {
  //   campaign.imageUrl = "http://localhost:3000/sample.jpg";
  //   await campaign.save();
  //   res();
  // }))
  // console.log(campaignPromises);
  // await Promise.all(campaignPromises);

  // const users = await User.find({});
  // const userUpdatePromiseArr: Array<Promise<IUser>> = [];
  // for (let user of users) {
  //   if (!(user.imageUrl)) {
  //     const imageUrl = DEFAULT_IMAGES[user.username[0].toUpperCase()] || "";
  //     user.imageUrl = imageUrl
  //     userUpdatePromiseArr.push(user.save());
  //   }
  // }

  // await Promise.all(userUpdatePromiseArr);
  console.log("done");

  // disconnected
  await mongoose.disconnect();
  console.log("disconnected");

}

run();