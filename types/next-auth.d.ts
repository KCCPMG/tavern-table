// import NextAuth from "next-auth";
import { Session } from "next-auth";
import User from "./User";
import mongoose from "mongoose";


// rename User for use inside "next-auth" module
interface UserAlias extends User {
  testProperty?: string
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {

    user: {
      username?: string,
      _id?: string,
      email?: string,
      imageUrl?: string,
      characters: Array<mongoose.Types.ObjectId>,
      campaigns: Array<mongoose.Types.ObjectId>,
      friends: Array<mongoose.Types.ObjectId>,
    }
  
  }

  // User from "types/User"
  interface User extends UserAlias {}

}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
  }
}

// import { Session } from "next-auth";
// import { JWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     id: string;
//     role: number;
//   }

//   interface User {
//     id: string;
//     role: number;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: number;
//   }
// }