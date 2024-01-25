import "@/styles/global.css";
import Navbar from "components/Navbar";
import AuthProvider from "context/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <h1 className="text-3xl font-bold underline">text-3xl font-bold underline</h1>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
