"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EventDTO } from "@/lib/types";
import { fmtDate, fmtTime } from "@/lib/format";

const DEPARTMENTS = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Data Science", "Business", "Other",
];
const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"] as const;

type Status = "idle" | "sending" | "done";

export default function EventDetail({ event }: { event: EventDTO }) {
  const router = useRouter();
  const full = event.spotsLeft <= 0;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState<string>("Senior");
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState(true);
  const [vegCatering, setVegCatering] = useState(false);
  const [bringLaptop, setBringLaptop] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          college: `${dept}, ${year}`,
          phone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }
      setStatus("done");
      // trigger music on successful registration
      window.dispatchEvent(new CustomEvent("play-music"));
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <main className="mx-auto max-w-lg px-5 py-10 pb-20">
        <div className="rounded-xl border border-accent/50 bg-panel p-8 text-center">
          <div className="text-5xl">🎉</div>
          <h2 className="mt-4 font-display text-3xl text-accent">You&apos;re in!</h2>
          <p className="mt-2 text-muted">Registration confirmed for <strong className="text-ink">{event.name}</strong>.</p>
          <div className="mt-6 rounded-lg bg-gradient-to-br from-accent-2/80 to-accent-2/40 p-5 text-left">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">codeclub</p>
            <p className="mt-1 text-lg font-bold text-white">Student Workshop Pass</p>
            <div className="mt-3 border-t border-white/20 pt-3">
              <p className="font-mono text-xs text-white/60">attendee</p>
              <p className="font-bold text-white">{name}</p>
              <p className="font-mono text-xs text-white/70">{dept} · {year}</p>
            </div>
          </div>
          <p className="mt-4 font-mono text-xs text-muted">See you there! Check your email for details.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-8 pb-20">
      {/* Event Header */}
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-accent/20 px-3 py-1 font-mono text-xs font-semibold text-accent">
          Free Admission · {event.spotsLeft} seats left
        </span>
        <span className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${full ? "bg-red-500/20 text-red-400" : "bg-accent/20 text-accent"}`}>
          RSVP {full ? "Closed" : "Open"}
        </span>
      </div>
      <h1 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">{event.name}</h1>
      <div className="mt-3 space-y-1 font-mono text-sm text-muted">
        <p>📅 {fmtDate(event.date)} · {fmtTime(event.date)}</p>
        <p>📍 {event.venue}</p>
      </div>
      <p className="mt-3 text-sm text-muted">{event.description}</p>

      {/* Pass Preview */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Pass Preview</h2>
          <span className="flex items-center gap-1 font-mono text-xs text-green-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" /> Live Sync
          </span>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl bg-gradient-to-br from-accent-2/80 to-accent-2/40 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">codeclub</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-white/20 p-1.5 text-white">🎓</span>
            <span className="text-lg font-bold text-white">Student Workshop Pass</span>
          </div>
          {name && (
            <div className="mt-4 border-t border-white/20 pt-3">
              <p className="font-mono text-[10px] uppercase text-white/60">attendee</p>
              <p className="font-bold text-white">{name || "—"}</p>
              <p className="font-mono text-xs text-white/70">{dept} · {year}</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="mt-8">
        <h2 className="text-lg font-bold">Save your spot</h2>
        <p className="mt-1 text-sm text-muted">
          Takes 30 seconds. We use this to get a headcount for catering and room capacity.
        </p>

        <div className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs text-muted">Your Name</label>
              {name.length > 1 && <span className="font-mono text-xs text-green-400">✓ Verified</span>}
            </div>
            <input
              value={name} onChange={(e) => setName(e.target.value)} required maxLength={80}
              className="mt-1 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="Jordan Lin"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-mono text-xs text-muted">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={100}
              className="mt-1 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="you@college.edu"
            />
          </div>

          {/* Department */}
          <div>
            <label className="font-mono text-xs text-muted">Major / Department</label>
            <select
              value={dept} onChange={(e) => setDept(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-accent"
            >
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Year pills */}
          <div>
            <label className="font-mono text-xs text-muted">Year</label>
            <div className="mt-2 flex gap-2">
              {YEARS.map((y) => (
                <button
                  key={y} type="button" onClick={() => setYear(y)}
                  className={`rounded-full px-4 py-1.5 font-mono text-xs transition ${
                    year === y
                      ? "bg-accent-2 font-semibold text-white"
                      : "bg-panel text-muted hover:text-ink"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="font-mono text-xs text-muted">
              Phone number <span className="text-muted/60">(for SMS door codes & reminders)</span>
            </label>
            <input
              type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)}
              required maxLength={15}
              className="mt-1 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="+1 (206) 555-0194"
            />
          </div>

          {/* SMS toggle */}
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-line bg-panel px-4 py-3">
            <div>
              <p className="text-sm font-medium">SMS Check-in Reminders</p>
              <p className="text-xs text-muted">Get seat location & door codes 30m prior</p>
            </div>
            <input
              type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)}
              className="h-5 w-5 accent-accent-2"
            />
          </label>
        </div>

        {/* Workshop Preferences */}
        <div className="mt-8">
          <h3 className="text-lg font-bold">Workshop Preferences</h3>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-line bg-panel px-4 py-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-green-400">🥗</span> I would like vegetarian / vegan catering
                </p>
                <p className="text-xs text-muted">Catered poke bowl & drinks provided</p>
              </div>
              <input
                type="checkbox" checked={vegCatering} onChange={(e) => setVegCatering(e.target.checked)}
                className="h-5 w-5 accent-accent-2"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-line bg-panel px-4 py-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span>💻</span> I will bring my own laptop
                </p>
                <p className="text-xs text-muted">Need power strip outlet access</p>
              </div>
              <input
                type="checkbox" checked={bringLaptop} onChange={(e) => setBringLaptop(e.target.checked)}
                className="h-5 w-5 accent-accent-2"
              />
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit" disabled={status === "sending" || full}
          className="mt-6 w-full rounded-xl bg-accent-2 px-6 py-4 font-mono text-base font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Confirming..." : full ? "Event is full" : "🎟 Confirm my spot"}
        </button>

        <p className="mt-3 text-center font-mono text-xs text-muted">
          Free event · You can cancel anytime from your email confirmation
        </p>
      </form>
    </main>
  );
}
