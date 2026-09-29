"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventDTO, RegDTO } from "@/lib/types";
import { fmtDate, fmtTime } from "@/lib/format";
import EventForm from "./EventForm";

export default function AdminDashboard({ events, registrations }: { events: EventDTO[]; registrations: RegDTO[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<EventDTO | "new" | null>(null);
  const [q, setQ] = useState("");
  const [eventId, setEventId] = useState("all");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (editing && !d.open) d.showModal();
    if (!editing && d.open) d.close();
  }, [editing]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function remove(e: EventDTO) {
    const n = e.capacity - e.spotsLeft;
    if (!confirm(`Delete "${e.name}"${n ? ` and its ${n} registration(s)` : ""}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/events/${e.id}`, { method: "DELETE" });
    if (!res.ok) alert("Delete failed.");
    router.refresh();
  }

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return registrations.filter(
      (r) =>
        (eventId === "all" || r.eventId === Number(eventId)) &&
        (!s || `${r.name} ${r.email} ${r.college}`.toLowerCase().includes(s))
    );
  }, [registrations, q, eventId]);

  // Stats
  const totalRSVPs = registrations.length;
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcomingCount = events.filter((e) => new Date(e.date).getTime() >= now).length;
  const totalCapacity = events.reduce((a, e) => a + e.capacity, 0);
  const totalRegistered = events.reduce((a, e) => a + (e.capacity - e.spotsLeft), 0);
  const avgTurnout = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;
  const activeEvents = events.filter((e) => new Date(e.date).getTime() >= now);

  function initials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">administration</p>
          <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            Club Organizer<br />Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 rounded-lg bg-accent-2 px-4 py-2.5 font-mono text-sm font-semibold text-white transition hover:opacity-90"
          >
            <span className="text-lg">+</span> Create New Event
          </button>
          <button onClick={logout} className="font-mono text-xs text-muted hover:text-ink">logout</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-xs">Total RSVPs</span>
            <span>👥</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalRSVPs}</p>
          <p className="mt-1 font-mono text-xs text-green-400">↗ active</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-xs">Upcoming Events</span>
            <span>📅</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{upcomingCount}</p>
          <p className="mt-1 font-mono text-xs text-green-400">● All on track</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-xs">Avg Turnout</span>
            <span>👥</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{avgTurnout}%</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between text-muted">
            <span className="font-mono text-xs">Checked In Today</span>
            <span>✅</span>
          </div>
          <p className="mt-2 text-3xl font-bold">—</p>
          <p className="mt-1 font-mono text-xs text-muted">coming soon</p>
        </div>
      </div>

      {/* Your Events */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Your Events</h2>
          <span className="font-mono text-xs text-muted">{activeEvents.length} active</span>
        </div>
        <div className="mt-3 space-y-3">
          {events.map((e) => {
            const registered = e.capacity - e.spotsLeft;
            const pct = e.capacity > 0 ? Math.round((registered / e.capacity) * 100) : 0;
            const isFull = e.spotsLeft <= 0;
            return (
              <div key={e.id} className="rounded-lg border border-line bg-panel p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{e.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${
                    isFull ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                  }`}>
                    {isFull ? "Full" : "Open"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted">
                  {registered} of {e.capacity} spots taken · {fmtDate(e.date)}
                </p>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex gap-4 font-mono text-xs">
                  <button onClick={() => setEditing(e)} className="text-accent hover:underline">Edit</button>
                  <span className="text-muted">Roster</span>
                  <button onClick={() => remove(e)} className="text-red-400 hover:underline">Cancel event</button>
                </div>
              </div>
            );
          })}
          {!events.length && (
            <p className="rounded-lg border border-dashed border-line p-8 text-center font-mono text-xs text-muted">
              no events yet — create one above
            </p>
          )}
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold">Recent Registrations</h2>
            <p className="font-mono text-xs text-muted">Real-time attendee check-in stream</p>
          </div>
          <a
            href={`/api/admin/registrations/export${eventId === "all" ? "" : `?eventId=${eventId}`}`}
            className="font-mono text-xs text-accent hover:underline"
          >
            📥 Export CSV
          </a>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Find attendee by name or email..."
              className="w-full rounded-lg border border-line bg-panel py-2.5 pl-9 pr-3 font-mono text-sm outline-none focus:border-accent"
            />
          </div>
          <select
            value={eventId} onChange={(e) => setEventId(e.target.value)}
            className="rounded-lg border border-line bg-panel px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
          >
            <option value="all">All events</option>
            {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        <p className="mt-3 font-mono text-xs text-muted">{shown.length} registration{shown.length === 1 ? "" : "s"}</p>

        <div className="mt-2 space-y-2">
          {shown.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg border border-line bg-panel p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-2/20 font-mono text-xs font-bold text-accent-2">
                {initials(r.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{r.name}</span>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent">
                    Registered
                  </span>
                </div>
                <p className="truncate font-mono text-xs text-muted">
                  {r.college} · {r.email}
                </p>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="font-mono text-xs text-muted">{r.eventName}</p>
                <p className="font-mono text-[10px] text-muted">{fmtDate(r.createdAt)}</p>
              </div>
            </div>
          ))}
          {!shown.length && (
            <p className="rounded-lg border border-dashed border-line p-8 text-center font-mono text-xs text-muted">
              no registrations found
            </p>
          )}
        </div>
      </div>

      {/* Event Form Dialog */}
      <dialog
        ref={dialogRef}
        onClose={() => setEditing(null)}
        onClick={(e) => e.target === dialogRef.current && setEditing(null)}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-line bg-panel p-0 text-ink backdrop:bg-black/70"
      >
        {editing && (
          <EventForm
            key={editing === "new" ? "new" : editing.id}
            event={editing === "new" ? undefined : editing}
            onDone={() => { setEditing(null); router.refresh(); }}
            onCancel={() => setEditing(null)}
          />
        )}
      </dialog>
    </main>
  );
}