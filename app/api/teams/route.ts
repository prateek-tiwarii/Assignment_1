import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    where: (session.user as any).role === "USER" 
      ? { members: { some: { id: (session.user as any).id } } }
      : {},
    include: {
      manager: { select: { name: true } },
      members: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only Managers and Admins can create teams
  if ((session.user as any).role === "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, memberIds } = await req.json();

  const team = await prisma.team.create({
    data: {
      name,
      managerId: (session.user as any).id,
      members: {
        connect: memberIds?.map((id: string) => ({ id })) || [],
      },
    },
  });

  return NextResponse.json(team);
}
