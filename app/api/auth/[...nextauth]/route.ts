import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


const options: NextAuthOptions = {
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
      async authorize(credentials, request) {

        console.log("test from CredentialsProvider authorize");
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          console.log("authorize: yes user");
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
    maxAge: 24 * 60 * 60 // 24 hours
  }
}

const handler = NextAuth(options);

export {handler as GET, handler as POST};