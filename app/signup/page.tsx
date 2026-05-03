"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-[linear-gradient(120deg,#f6f3ec_0%,#eef1f6_55%,#f2f1ec_100%)] py-12 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_14%,rgba(204,224,255,0.42),transparent_30%),radial-gradient(circle_at_10%_70%,rgba(247,220,183,0.35),transparent_36%)]" />
      
      <Card className="relative w-full max-w-md rounded-3xl border-black/10 bg-white/75 shadow-[0_16px_45px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-semibold tracking-tight">Sign Up</CardTitle>
          <p className="text-sm text-neutral-500">Create an account to start managing your tasks</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Full Name</label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Email</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/80"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full h-11 rounded-full text-[15px]" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-neutral-900 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
