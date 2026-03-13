import { prisma } from "@/lib/prisma"
import { GUEST_UPDATED_AUDIT, withGuestAudit } from "@/lib/task-audit"
import { NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{ id: string }>
}

async function resolveTaskId(context: RouteContext): Promise<string | null> {
  const { id } = await context.params
  return id?.trim() ? id : null
}

export async function GET(
  _req: Request,
  context: RouteContext
) {
  const id = await resolveTaskId(context)
  if (!id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 })
  }

  const task = await prisma.task.findUnique({
    where: { id },
  })

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(withGuestAudit(task))
}

export async function PUT(
  req: Request,
  context: RouteContext
) {
  const id = await resolveTaskId(context)
  if (!id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 })
  }

  const body = await req.json()

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      ...body,
      ...GUEST_UPDATED_AUDIT,
    },
  })

  return NextResponse.json(updatedTask)
}

export async function DELETE(
  _req: Request,
  context: RouteContext
) {
  const id = await resolveTaskId(context)
  if (!id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 })
  }

  await prisma.task.delete({
    where: { id },
  })

  return NextResponse.json({
    message: "Task deleted successfully",
  })
}