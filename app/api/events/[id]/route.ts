import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { err } from "@/lib/http";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!n) return err("Invalid ID", 400);

  const event = await prisma.event.findUnique({
    where: { id: n },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) return err("Not found", 404);

  return NextResponse.json({
    id: event.id,
    name: event.name,
    category: event.category,
    date: event.date.toISOString(),
    venue: event.venue,
    description: event.description,
    capacity: event.capacity,
    featured: event.featured,
    spotsLeft: event.capacity - event._count.registrations,
  });
}
