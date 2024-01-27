import NextAuth from "next-auth";
import User from "./User";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // example
    // user: {
    //   /** The user's postal address. */
    //   address: string
    // }
    user: {
      username?: string,
      id?: number,
      email?: string
    }
  }
}