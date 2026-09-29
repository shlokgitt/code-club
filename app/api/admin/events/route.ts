import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { parseEvent } from "@/lib/validate";
import { err } from "@/lib/http";

export async function POST(req: Request) {
  if (!(await isAdmin())) return err("Unauthorized", 401);
  const r = parseEvent(await req.json().catch(() => ({})));
  if (!r.ok) return err(r.error);

  await prisma.$transaction(async (tx) => {
    if (r.data.featured) await tx.event.updateMany({ data: { featured: false } });
    await tx.event.create({ data: r.data });
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}