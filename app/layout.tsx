import "@/styles/global.css";
import Navbar from "components/Navbar";
import AuthProvider from "context/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ToasterContextProvider } from "context/ToasterContext";
import { ModalContextProvider } from "context/ModalContext";
import Toaster from "components/Toast";
import MainContainer from "components/MainContainer";

type PropsType = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: PropsType) {

  // console.log("Layout Session:", {session});
  // console.log("Layout:", session?.user);

  // console.log(session?.user.username); // why doesn't this work?

  return (
    <html lang="en">
      <ToasterContextProvider>
        <AuthProvider>
          <ModalContextProvider>
            <body className="h-screen flex flex-col">
              <Navbar/>
              <Toaster />
              <MainContainer>
                {children}
              </MainContainer>
            </body>
          </ModalContextProvider>
        </AuthProvider>
      </ToasterContextProvider>
    </html>
  )
}
