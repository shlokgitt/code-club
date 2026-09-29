"use client";
import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import { CATEGORIES, type EventDTO } from "@/lib/types";

export default function EventBrowser({ events }: { events: EventDTO[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const shown = useMemo(
    () =>
      events.filter(
        (e) =>
          e.name.toLowerCase().includes(q.trim().toLowerCase()) &&
          (cat === "All" || e.category === cat)
      ),
    [events, q, cat]
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="block sm:w-72">
          <span className="sr-only">Search events</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search events..."
            className="w-full rounded border border-line bg-panel px-3 py-2 font-mono text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded border px-3 py-1 font-mono text-xs transition ${
                cat === c ? "border-accent bg-accent text-black" : "border-line text-muted hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-muted">
        {shown.length} event{shown.length === 1 ? "" : "s"}
      </p>

      {shown.length ? (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded border border-dashed border-line p-10 text-center font-mono text-sm text-muted">
          no events match. try a different search.
        </p>
      )}
    </div>
  );
}