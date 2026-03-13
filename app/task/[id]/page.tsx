"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import {
  deleteTask,
  getTask,
  type Task,
  toApiDueDate,
  toInputDate,
  updateTask,
  type TaskStatus,
} from "@/lib/task-api"

type EditTaskForm = {
  title: string
  description: string
  dueDate: string
  status: TaskStatus
  remarks: string
}

export default function EditTask() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const taskId = params.id

  const [form, setForm] = useState<EditTaskForm>({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    remarks: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [auditInfo, setAuditInfo] = useState<Pick<Task, "createdByName" | "createdById" | "updatedByName" | "updatedById"> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTask() {
      try {
        setIsLoading(true)
        setError(null)
        const task = await getTask(taskId)

        if (!cancelled) {
          setForm({
            title: task.title,
            description: task.description,
            dueDate: toInputDate(task.dueDate),
            status: task.status,
            remarks: task.remarks ?? "",
          })
          setAuditInfo({
            createdByName: task.createdByName,
            createdById: task.createdById,
            updatedByName: task.updatedByName,
            updatedById: task.updatedById,
          })
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load task")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadTask()

    return () => {
      cancelled = true
    }
  }, [taskId])

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError(null)

      await updateTask(taskId, {
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: toApiDueDate(form.dueDate),
        status: form.status,
        remarks: form.remarks.trim() || null,
      })

      router.push("/task")
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update task")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this task? This action cannot be undone.")
    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      await deleteTask(taskId)
      router.push("/task")
      router.refresh()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[linear-gradient(180deg,#f8f6ef_0%,#eeeff3_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4 rounded-full text-neutral-700">
          <Link href="/task" className="inline-flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>

        <Card className="w-full rounded-3xl border-black/10 bg-white/85 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm">

          <CardHeader className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-neutral-500">Task Details</p>
            <CardTitle className="text-2xl tracking-tight">Edit task</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="py-8 text-sm text-neutral-600">Loading task...</p>
            ) : (
              <form className="space-y-4" onSubmit={handleUpdate}>
                {auditInfo ? (
                  <div className="rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                    <p>Created By: {auditInfo.createdByName} ({auditInfo.createdById})</p>
                    <p className="mt-1">Last Updated By: {auditInfo.updatedByName} ({auditInfo.updatedById})</p>
                  </div>
                ) : null}

                <Input
                  placeholder="Task Title"
                  className="h-11 rounded-xl border-black/10"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                />

                <Textarea
                  placeholder="Task Description"
                  className="min-h-28 rounded-xl border-black/10"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  required
                />

                <Input
                  type="date"
                  className="h-11 rounded-xl border-black/10"
                  value={form.dueDate}
                  onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
                  required
                />

                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((current) => ({ ...current, status: value as TaskStatus }))}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-black/10">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Remarks"
                  className="min-h-24 rounded-xl border-black/10"
                  value={form.remarks}
                  onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))}
                />

                {error ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="h-11 flex-1 rounded-xl text-[15px]" disabled={isSubmitting || isDeleting}>
                    {isSubmitting ? "Updating..." : "Update Task"}
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="h-11 flex-1 rounded-xl"
                    disabled={isSubmitting || isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? "Deleting..." : "Delete Task"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

        </Card>
      </div>
    </section>
  )
}