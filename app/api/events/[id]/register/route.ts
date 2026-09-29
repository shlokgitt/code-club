import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { err } from "@/lib/http";

const clean = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const b = await req.json().catch(() => ({}));
  const data = {
    name: clean(b.name, 80),
    email: clean(b.email, 100).toLowerCase(),
    college: clean(b.college, 100),
    phone: clean(b.phone, 15),
  };

  if (!data.name || !data.college) return err("Name and college/year are required.");
  if (!/^\S+@\S+\.\S+$/.test(data.email)) return err("Enter a valid email.");
  if (!/^\d{10}$/.test(data.phone.replace(/[\s-]/g, ""))) return err("Phone must be 10 digits.");

  const event = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) return err("Event not found.", 404);
  if (event._count.registrations >= event.capacity) return err("This event is full.", 409);

  try {
    await prisma.registration.create({ data: { ...data, eventId: id } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return err("This email is already registered.", 409);
    throw e;
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
