import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      creator: { select: { name: true } },
      assignee: { select: { name: true } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // RBAC check
  if (
    (session.user as any).role === "USER" &&
    task.creatorId !== (session.user as any).id &&
    task.assigneeId !== (session.user as any).id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    ...task,
    creatorName: task.creator.name,
    assigneeName: task.assignee?.name,
  });
}

export async function PUT(req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // RBAC check: Only creator, assignee, or Manager/Admin can update
  if (
    (session.user as any).role === "USER" &&
    existingTask.creatorId !== (session.user as any).id &&
    existingTask.assigneeId !== (session.user as any).id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, dueDate, status, remarks, projectId, assigneeId } = body;

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status,
      remarks,
      projectId,
      assigneeId,
      updaterId: (session.user as any).id,
    },
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // RBAC check: Only creator or Manager/Admin can delete
  if (
    (session.user as any).role === "USER" &&
    existingTask.creatorId !== (session.user as any).id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Task deleted successfully",
  });
}