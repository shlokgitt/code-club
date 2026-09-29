import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventDetail from "@/components/EventDetail";
import type { EventDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!n) notFound();

  const row = await prisma.event.findUnique({
    where: { id: n },
    include: { _count: { select: { registrations: true } } },
  });
  if (!row) notFound();

  const event: EventDTO = {
    id: row.id,
    name: row.name,
    category: row.category,
    date: row.date.toISOString(),
    venue: row.venue,
    description: row.description,
    capacity: row.capacity,
    featured: row.featured,
    spotsLeft: row.capacity - row._count.registrations,
  };

  return <EventDetail event={event} />;
}
