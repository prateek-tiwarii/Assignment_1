import { prisma } from "@/lib/prisma"
import { GUEST_AUDIT, withGuestAudit } from "@/lib/task-audit"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  const tasks = await prisma.task.findMany({
    where: search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {},
    orderBy: { createdOn: "desc" },
  })

  return NextResponse.json(tasks.map((task) => withGuestAudit(task)))
}

export async function POST(req: Request) {
  const body = await req.json()

  const task = await prisma.task.create({
    data: {
      ...body,
      ...GUEST_AUDIT,
    },
  })

  return NextResponse.json(task)
}