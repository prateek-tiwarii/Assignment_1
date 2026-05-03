import type { Metadata } from "next"
import "./globals.css"

import { Outfit, IBM_Plex_Mono } from "next/font/google"
import NextAuthSessionProvider from "@/components/providers/SessionProvider"
import Header from "@/components/Header"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Task Manager",
  description: "MVC Task Management Application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${ibmPlexMono.variable} antialiased`}>
        <NextAuthSessionProvider>
          <Header />
          <main>{children}</main>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}