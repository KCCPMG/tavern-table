import User from '@/models/User';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextError } from "@/lib/NextError";
import mongooseConnect from '@/lib/mongooseConnect';
// import User from 'types/User';
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
// import clientPromise from "../../../lib/mongodb"

export const authOptions: NextAuthOptions = {
  // adapter: {
  //   MongoDBAdapter(clientPromise);
  // },
  pages: {
    signIn: '/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/register'
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username"  
        },
        password: {
          label: "password",
          type: "password"
        },
        register: {
          label: "register",
          type: "boolean",
        },
        email: {
          label: "email",
          type: "email"
        }
      },
      async authorize(credentials, request): Promise<any> {

        try {
          // console.log("\ntest from CredentialsProvider authorize");
          // const user = { id: "1", username: "J Smith", email: "jsmith@example.com", testProperty: "test" }
  
          // console.log({credentials});

          await mongooseConnect();

          if (credentials?.register) {
            const user = await User.register({
              username: credentials.username ,
              email: credentials.email ,
              password: credentials.password 
            })

            return user;
            
          } else {
            const user = await User.authenticate(credentials!.username, credentials!.password);
            
            // console.log("authorize: ", {user});
            return user;

          }


          // Any object returned will be saved in `user` property of the JWT

          // if no user, error will throw
  

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter

        } catch(e) {

          // If you return null then an error will be displayed advising the user to check their details.

          /**
          if ((e as any).name === NextError.name) {
            const err = e as NextError;
            return new Response(err.message, {
              status: err.status
            })
          }
          // all errors should be NextErrors, if not, send server error
          else return Response.error()
           */
          // console.log("authorize: no user");
          // console.log(e);
          throw(e);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",  // default, specify for clarity
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async redirect( {url, baseUrl} ) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl;
    },
    async jwt( props ) {
      // console.log("\n\njwt callback:", {...props})
      // console.log("jwt callback", {props});
      const {user, token} = props;
      // console.log("\n\njwt callback:", { user, token, session });
      if (user) {
        return {
          ...token,
          // ...user,
          // username: user.username,
          // testProperty: user.testProperty
          user
        }
      }
      return token;
    },
    async session( props ) {
      // console.log("\n\nsession callback:", {...props})
      // it seems as though there will never be a user in the props, needs to be extracted from session
      const {session, token} = props;
      // console.log("\n\nnsession callback:", { user, token, session } );
      // console.log("session callback", {props});

      const user = token.user || {};

      const toReturn = {
        ...session,
        user: {
          // ...session.user,
          // testProperty: token.testProperty,
          // username: token.username,
          // _id: token._doc._id,
          // id: token._doc._id
          ...user
        }
      }
      // console.log({toReturn});
      return toReturn;
    }
  },
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};