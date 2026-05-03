"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session, status } = useSession();

  return (
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
            {session ? (
              <>
                <Link href="/task/create" className="rounded-full px-3 py-1.5 text-neutral-700 transition hover:bg-neutral-100">
                  New Task
                </Link>
                <div className="flex items-center gap-4 ml-2">
                  <span className="text-neutral-500 font-mono text-xs uppercase tracking-wider">{session.user?.name} ({ (session.user as any).role })</span>
                  <Button variant="outline" size="sm" onClick={() => signOut()} className="rounded-full">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login" className="rounded-full px-3 py-1.5 text-neutral-700 transition hover:bg-neutral-100">
                  Login
                </Link>
                <Link href="/signup" className="rounded-full bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Nav */}
        <nav className="flex items-center gap-2 pb-3 text-sm font-medium md:hidden">
          <Link href="/" className="flex-1 rounded-full border border-black/10 bg-white px-3 py-2 text-center text-neutral-700">
            Home
          </Link>
          <Link href="/task" className="flex-1 rounded-full border border-black/10 bg-white px-3 py-2 text-center text-neutral-700">
            Tasks
          </Link>
          {!session && (
            <Link href="/login" className="flex-1 rounded-full bg-neutral-900 px-3 py-2 text-center text-white">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
