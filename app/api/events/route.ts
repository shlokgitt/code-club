import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
  return NextResponse.json(
    events.map(({ _count, ...e }) => ({ ...e, spotsLeft: e.capacity - _count.registrations }))
  );
}
