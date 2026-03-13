"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Clock3, Plus, Search } from "lucide-react"
import { deleteTask, listTasks, type Task } from "@/lib/task-api"

const statusBadgeClass: Record<Task["status"], string> = {
  pending: "rounded-full border border-amber-200 bg-amber-50 text-amber-800",
  inprogress: "rounded-full border border-sky-200 bg-sky-50 text-sky-800",
  completed: "rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800",
}

function formatStatus(status: Task["status"]): string {
  if (status === "inprogress") {
    return "In Progress"
  }

  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function TasksPage() {
  const [query, setQuery] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTasks() {
      try {
        setIsLoading(true)
        setError(null)
        const result = await listTasks(query)

        if (!cancelled) {
          setTasks(result)
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load tasks")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    const timeoutId = window.setTimeout(loadTasks, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [query])

  const stats = useMemo(() => {
    return {
      pending: tasks.filter((task) => task.status === "pending").length,
      inprogress: tasks.filter((task) => task.status === "inprogress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }
  }, [tasks])

  async function handleDelete(taskId: string) {
    const confirmed = window.confirm("Delete this task? This action cannot be undone.")
    if (!confirmed) {
      return
    }

    try {
      setIsDeletingId(taskId)
      await deleteTask(taskId)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete task")
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[linear-gradient(120deg,#f6f3ec_0%,#eef1f6_55%,#f2f1ec_100%)] py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_14%,rgba(204,224,255,0.42),transparent_30%),radial-gradient(circle_at_10%_70%,rgba(247,220,183,0.35),transparent_36%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Task Manager</h1>
            <p className="mt-2 max-w-xl text-neutral-600">Keep your workflow visible and actionable with a single focused board.</p>
          </div>

          <Button asChild className="h-11 rounded-full px-5 text-[15px]">
            <Link href="/task/create" className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Link>
          </Button>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <Card className="rounded-2xl border-black/10 bg-white/75 shadow-none backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{stats.pending}</p>
              </div>
              <Clock3 className="h-5 w-5 text-neutral-500" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/10 bg-white/75 shadow-none backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">In Progress</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{stats.inprogress}</p>
              </div>
              <Clock3 className="h-5 w-5 text-neutral-500" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-black/10 bg-white/75 shadow-none backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Completed</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-neutral-500" />
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tasks..."
              className="h-11 rounded-full border-black/10 bg-white/80 pl-9"
            />
          </div>
        </div>

        {error ? (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {isLoading ? (
            <p className="col-span-full py-8 text-sm text-neutral-500">Loading tasks...</p>
          ) : null}

          {!isLoading && tasks.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-black/10 bg-white/75 px-5 py-8 text-sm text-neutral-600">
              No tasks found. Create one to get started.
            </p>
          ) : null}

          {tasks.map((task) => (
            <Card
              key={task.id}
              className="rounded-2xl border-black/10 bg-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)]"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>

                <Badge className={statusBadgeClass[task.status]}>{formatStatus(task.status)}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-neutral-600">{task.description}</p>

                <p className="text-xs text-neutral-500">Due: {formatDate(task.dueDate)}</p>

                <div className="space-y-1 text-xs text-neutral-500">
                  <p>
                    Created By: {task.createdByName} ({task.createdById})
                  </p>
                  <p>
                    Last Updated By: {task.updatedByName} ({task.updatedById})
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" asChild className="rounded-full">
                    <Link href={`/task/${task.id}`}>Edit</Link>
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => handleDelete(task.id)}
                    disabled={isDeletingId === task.id}
                  >
                    {isDeletingId === task.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </section>
  )
}