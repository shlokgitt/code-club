"use client";
import { useState } from "react";
import { CATEGORIES, type EventDTO } from "@/lib/types";
import { toInputValue } from "@/lib/format";

const field = "mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent";
const label = "block font-mono text-xs text-muted";

export default function EventForm({
  event, onDone, onCancel,
}: { event?: EventDTO; onDone: () => void; onCancel: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const body = {
      name: f.get("name"), category: f.get("category"), date: f.get("date"),
      venue: f.get("venue"), description: f.get("description"),
      capacity: Number(f.get("capacity")), featured: f.get("featured") === "on",
    };
    const res = await fetch(event ? `/api/admin/events/${event.id}` : "/api/admin/events", {
      method: event ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Network error.");
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Save failed.");
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-6">
      <h2 className="text-xl font-bold">{event ? "Edit event" : "Add event"}</h2>
      <label className={label}>name<input name="name" required maxLength={100} defaultValue={event?.name} className={field} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={label}>category
          <select name="category" defaultValue={event?.category ?? CATEGORIES[0]} className={field}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className={label}>capacity
          <input name="capacity" type="number" min={1} max={10000} required defaultValue={event?.capacity ?? 100} className={field} />
        </label>
      </div>
      <label className={label}>date & time (IST)
        <input name="date" type="datetime-local" required defaultValue={event ? toInputValue(event.date) : ""} className={field} />
      </label>
      <label className={label}>venue<input name="venue" required maxLength={100} defaultValue={event?.venue} className={field} /></label>
      <label className={label}>description
        <textarea name="description" required rows={3} maxLength={500} defaultValue={event?.description} className={field} />
      </label>
      <label className="flex items-center gap-2 font-mono text-xs text-muted">
        <input name="featured" type="checkbox" defaultChecked={event?.featured} className="accent-[var(--accent)]" />
        featured on home page
      </label>
      {error && <p role="alert" className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button disabled={busy} className="flex-1 rounded bg-accent px-4 py-2 font-mono text-sm font-semibold text-black disabled:opacity-60">
          {busy ? "saving..." : "save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded border border-line px-4 py-2 font-mono text-sm text-muted hover:text-ink">cancel</button>
      </div>
    </form>
  );
}