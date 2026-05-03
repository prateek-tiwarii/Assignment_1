import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const tasks = await prisma.task.findMany({
    where: {
      AND: [
        search
          ? {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        // Role-based access: Admin/Manager see all, Users see assigned/created
        (session.user as any).role === "USER"
          ? {
              OR: [
                { creatorId: (session.user as any).id },
                { assigneeId: (session.user as any).id },
              ],
            }
          : {},
      ],
    },
    include: {
      creator: { select: { name: true } },
      assignee: { select: { name: true } },
    },
    orderBy: { createdOn: "desc" },
  });

  // Map to include names for the UI
  const formattedTasks = tasks.map((task) => ({
    ...task,
    creatorName: task.creator.name,
    assigneeName: task.assignee?.name,
  }));

  return NextResponse.json(formattedTasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, dueDate, status, remarks, projectId, assigneeId } = body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      status: status || "pending",
      remarks,
      projectId,
      assigneeId,
      creatorId: (session.user as any).id,
    },
  });

  return NextResponse.json(task);
}