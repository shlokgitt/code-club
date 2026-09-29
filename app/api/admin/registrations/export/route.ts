import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { err } from "@/lib/http";

// Quote every cell, and neutralise spreadsheet formulas
function clean(val: unknown): string {
  const str = String(val ?? "");
  const safeStr = /^[=+@-]/ .test(str) ? `'${str}` : str;
  return `"${safeStr.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return err("Unauthorized", 401);

  const registrations = await prisma.registration.findMany({
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  const header = ["id", "event", "name", "email", "college", "phone", "createdAt"];
  const rows = registrations.map((r) => [
    r.id,
    r.event.name,
    r.name,
    r.email,
    r.college,
    r.phone,
    r.createdAt.toISOString(),
  ]);

  const csv = [
    header.map(clean).join(","),
    ...rows.map((row) => row.map(clean).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="registrations.csv"',
    },
  });
}
