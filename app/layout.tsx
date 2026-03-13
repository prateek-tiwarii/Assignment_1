import type { Metadata } from "next"
import "./globals.css"

import Link from "next/link"
import { Outfit, IBM_Plex_Mono } from "next/font/google"

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

        <header className="sticky top-0 z-30 border-b border-black/10 bg-white/85 backdrop-blur-md">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Task Manager
              </Link>

              <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
                <Link href="/" className="rounded-full px-3 py-1.5 text-neutral-700 transition hover:bg-neutral-100">
                  Home
                </Link>
                <Link href="/task" className="rounded-full px-3 py-1.5 text-neutral-700 transition hover:bg-neutral-100">
                  Tasks
                </Link>
                <Link href="/task/create" className="rounded-full bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700">
                  New Task
                </Link>
              </nav>
            </div>

            <nav className="flex items-center gap-2 pb-3 text-sm font-medium md:hidden">
              <Link href="/" className="flex-1 rounded-full border border-black/10 bg-white px-3 py-2 text-center text-neutral-700">
                Home
              </Link>
              <Link href="/task" className="flex-1 rounded-full border border-black/10 bg-white px-3 py-2 text-center text-neutral-700">
                Tasks
              </Link>
              <Link href="/task/create" className="flex-1 rounded-full bg-neutral-900 px-3 py-2 text-center text-white">
                New
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

      </body>
    </html>
  )
}