import "@/styles/global.css";
import Navbar from "components/Navbar";
import AuthProvider from "context/AuthProvider";
import { getServerSession } from "next-auth/next";
import User from "types/User";
import { authOptions } from "./api/auth/[...nextauth]/route";

type PropsType = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: PropsType) {

  const session = await getServerSession(authOptions);
  // console.log("Layout Session:", {session});
  // console.log("Layout:", session?.user);

  // console.log(session?.user.username); // why doesn't this work?

  return (
    <html lang="en">
      <AuthProvider>
        <body className="h-screen">
          <Navbar user={session?.user}/>
          <h1 className="text-3xl font-bold underline">text-3xl font-bold underline</h1>
          {children}
        </body>
      </AuthProvider>
    </html>
  )
}
