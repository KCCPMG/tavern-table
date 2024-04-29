import "@/styles/global.css";
import Navbar from "components/Navbar";
import AuthProvider from "context/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ToasterContextProvider } from "context/ToasterContext";
import Toaster from "components/Toast";

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
      <ToasterContextProvider>
        <AuthProvider>
          <body className="h-screen">
            <Navbar/>
            <Toaster />
            {children}
          </body>
        </AuthProvider>
      </ToasterContextProvider>
    </html>
  )
}
