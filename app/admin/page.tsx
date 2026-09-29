import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { getEvents } from "@/lib/events";
import type { RegDTO } from "@/lib/types";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · CodeClub" };

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const [events, rows] = await Promise.all([
    getEvents(),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      include: { event: { select: { name: true } } },
    }),
  ]);

  const registrations: RegDTO[] = rows.map((r) => ({
    id: r.id, name: r.name, email: r.email, college: r.college, phone: r.phone,
    createdAt: r.createdAt.toISOString(), eventId: r.eventId, eventName: r.event.name,
  }));

  return <AdminDashboard events={events} registrations={registrations} />;
}