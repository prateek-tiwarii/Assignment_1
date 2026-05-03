import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: (session.user as any).role === "USER" 
      ? { ownerId: (session.user as any).id }
      : {},
    include: {
      owner: { select: { name: true } },
    },
  });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();

  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: (session.user as any).id,
    },
  });

  return NextResponse.json(project);
}
