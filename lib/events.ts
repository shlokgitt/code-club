import prisma from "./prisma";
import type { EventDTO } from "./types";

export async function getEvents(): Promise<EventDTO[]> {
  const rows = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
  return rows.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    date: e.date.toISOString(),
    venue: e.venue,
    description: e.description,
    capacity: e.capacity,
    featured: e.featured,
    spotsLeft: e.capacity - e._count.registrations,
  }));
}