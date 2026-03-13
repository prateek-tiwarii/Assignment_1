export type TaskStatus = "pending" | "inprogress" | "completed"

export type Task = {
  id: string
  title: string
  description: string
  dueDate: string
  status: TaskStatus
  remarks: string | null
  createdOn: string
  updatedOn: string
  createdByName: string
  createdById: string
  updatedByName: string
  updatedById: string
}

export type TaskInput = {
  title: string
  description: string
  dueDate: string
  status: TaskStatus
  remarks?: string | null
}

const TASK_API_BASE = "/api/task"

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const errorMessage =
      body?.error ?? body?.message ?? `Request failed with status ${response.status}`

    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

export function toApiDueDate(dueDate: string): string {
  return `${dueDate}T00:00:00.000Z`
}

export function toInputDate(dueDate: string): string {
  return dueDate.slice(0, 10)
}

export async function listTasks(search?: string): Promise<Task[]> {
  const params = new URLSearchParams()

  if (search?.trim()) {
    params.set("search", search.trim())
  }

  const query = params.toString()
  const url = query ? `${TASK_API_BASE}?${query}` : TASK_API_BASE

  return apiRequest<Task[]>(url, { method: "GET" })
}

export async function getTask(id: string): Promise<Task> {
  return apiRequest<Task>(`${TASK_API_BASE}/${id}`, { method: "GET" })
}

export async function createTask(payload: TaskInput): Promise<Task> {
  return apiRequest<Task>(TASK_API_BASE, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateTask(id: string, payload: TaskInput): Promise<Task> {
  return apiRequest<Task>(`${TASK_API_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export async function deleteTask(id: string): Promise<void> {
  await apiRequest<{ message: string }>(`${TASK_API_BASE}/${id}`, {
    method: "DELETE",
  })
}
