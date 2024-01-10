import "@/styles/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <h1 className="text-3xl font-bold underline">text-3xl font-bold underline</h1>
        {children}
      </body>
    </html>
  )
}
