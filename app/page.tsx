import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ClipboardList, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#f5d9b8_0%,transparent_38%),radial-gradient(circle_at_80%_18%,#cddaf4_0%,transparent_34%),linear-gradient(180deg,#f8f7f3_0%,#edece6_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center px-4 py-14 sm:px-6">
        <div className="max-w-2xl space-y-8 animate-[fadeUp_.55s_ease-out]">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700">
            <Sparkles className="h-3.5 w-3.5" />
            Personal Productivity Hub
          </span>

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
              Plan your workday with clarity, not clutter.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-neutral-700 sm:text-lg">
              Organize tasks, keep priorities visible, and move faster with a focused workspace built for daily execution.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px]">
              <Link href="/task" className="inline-flex items-center gap-2">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="h-12 rounded-full px-7 text-[15px]">
              <Link href="/task/create">Create First Task</Link>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm">
              <p className="font-mono text-xs text-neutral-500">STATUS</p>
              <p className="mt-1 text-2xl font-semibold text-neutral-900">Trackable</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm">
              <p className="font-mono text-xs text-neutral-500">FLOW</p>
              <p className="mt-1 text-2xl font-semibold text-neutral-900">Focused</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm">
              <p className="font-mono text-xs text-neutral-500">PACE</p>
              <p className="mt-1 text-2xl font-semibold text-neutral-900">Consistent</p>
            </div>
          </div>
        </div>

        <div className="hidden flex-1 justify-end md:flex">
          <div className="w-full max-w-sm rounded-3xl border border-black/10 bg-white/75 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.08)] backdrop-blur-md animate-[fadeUp_.75s_ease-out]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-neutral-100 p-2">
                <ClipboardList className="h-5 w-5 text-neutral-700" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">Today at a glance</p>
            </div>
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="rounded-xl border border-black/10 bg-white p-3">Review assignment scope</div>
              <div className="rounded-xl border border-black/10 bg-white p-3">Build task CRUD flow</div>
              <div className="rounded-xl border border-black/10 bg-white p-3">Submit before 6:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}