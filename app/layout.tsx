import "@/styles/global.css";
import Navbar from "components/Navbar";
import AuthProvider from "context/AuthProvider";
import { getServerSession } from "next-auth/next";
import User from "types/User";

type PropsType = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: PropsType) {

  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar user={session?.user as User}/>
          <h1 className="text-3xl font-bold underline">text-3xl font-bold underline</h1>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
