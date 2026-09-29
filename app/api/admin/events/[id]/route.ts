import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { parseEvent } from "@/lib/validate";
import { err } from "@/lib/http";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return err("Unauthorized", 401);
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return err("Bad id.");

  const r = parseEvent(await req.json().catch(() => ({})));
  if (!r.ok) return err(r.error);

  const event = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) return err("Event not found.", 404);
  if (r.data.capacity < event._count.registrations)
    return err(`Capacity can't be below current registrations (${event._count.registrations}).`, 409);

  await prisma.$transaction(async (tx) => {
    if (r.data.featured) await tx.event.updateMany({ where: { id: { not: id } }, data: { featured: false } });
    await tx.event.update({ where: { id }, data: r.data });
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return err("Unauthorized", 401);
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return err("Bad id.");
  try {
    await prisma.event.delete({ where: { id } }); // registrations cascade
  } catch {
    return err("Event not found.", 404);
  }
  return NextResponse.json({ ok: true });
}