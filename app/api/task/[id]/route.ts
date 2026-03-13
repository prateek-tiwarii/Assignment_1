import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
  })

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...body,
      updatedByName: "Prateek",
      updatedById: "1",
    },
  })

  return NextResponse.json(updatedTask)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: params.id },
  })

  return NextResponse.json({
    message: "Task deleted successfully",
  })
}