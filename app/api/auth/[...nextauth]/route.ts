import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from 'types/User';


export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
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
        }
      },
      async authorize(credentials, request): Promise<any> {

        console.log("\ntest from CredentialsProvider authorize");
        const user = { id: "1", username: "J Smith", email: "jsmith@example.com", testProperty: "test" }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          console.log("authorize: ", {user});
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          console.log("authorize: no user");
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",  // default, specify for clarity
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async redirect( {url, baseUrl} ) {
      return '/'
    },
    async jwt( {user, token, session} ) {
      console.log("\n\njwt callback:", { user, token, session });
      if (user) {
        return {
          ...token,
          username: user.username,
          testProperty: user.testProperty
        }
      }
      return token;
    },
    async session( {session, token, user} ) {
      console.log("session callback:", { user, token, session } );
      return {
        ...session,
        user: {
          ...session.user,
          testProperty: token.testProperty,
          username: token.username
        }
      }
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};