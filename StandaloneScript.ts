import User, { IUser } from "@/models/User";
import { DEFAULT_IMAGES } from "@/models/constants";
import dotenv from "dotenv";
import mongoose from "mongoose";


async function run() {
  
  // mongoose setup
  dotenv.config({path: ".env.local"});
  // console.log("process.env", process.env);

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

  const users = await User.find({});
  const userUpdatePromiseArr: Array<Promise<IUser>> = [];
  for (let user of users) {
    if (!(user.imageUrl)) {
      const imageUrl = DEFAULT_IMAGES[user.username[0].toUpperCase()] || "";
      user.imageUrl = imageUrl
      userUpdatePromiseArr.push(user.save());
    }
  }

  await Promise.all(userUpdatePromiseArr);
  console.log("done");

  // disconnected
  await mongoose.disconnect();
  console.log("disconnected");

}

run();