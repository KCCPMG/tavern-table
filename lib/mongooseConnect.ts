import mongoose from "mongoose";
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function mongooseConnect() {
  if (cached.conn) {
    // console.log("mongooseConnect", cached.conn.now())
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // console.log("mongooseConnect", cached.conn.now())
  return cached.conn;
}

export default mongooseConnect;