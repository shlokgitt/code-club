"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventDTO } from "@/lib/types";
import { fmtDate, fmtTime } from "@/lib/format";

type Status = "idle" | "sending" | "done";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-muted">{label}</span>
      <input
        {...props}
        required
        className="mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

export default function RegisterButton({ event }: { event: EventDTO }) {
  const full = event.spotsLeft <= 0;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function open() {
    setStatus("idle");
    setError("");
    dialogRef.current?.showModal();
  }
  const close = () => dialogRef.current?.close();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    const f = new FormData(e.currentTarget);
    const body = {
      name: f.get("name"),
      email: f.get("email"),
      college: f.get("college"),
      phone: f.get("phone"),
    };
    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }
      setStatus("done");
      router.refresh(); // re-fetch server data so "spots left" updates
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <button
        disabled={full}
        onClick={open}
        className="w-full rounded bg-accent px-4 py-2 font-mono text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted md:w-fit"
      >
        {full ? "full" : "register →"}
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line bg-panel p-0 text-ink backdrop:bg-black/70"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-accent">{"// register"}</p>
              <h2 className="mt-1 text-xl font-bold">{event.name}</h2>
              <p className="mt-1 font-mono text-xs text-muted">
                {fmtDate(event.date)} · {fmtTime(event.date)} · {event.venue}
              </p>
            </div>
            <button onClick={close} aria-label="Close" className="font-mono text-muted hover:text-ink">
              ✕
            </button>
          </div>

          {status === "done" ? (
            <div className="py-8 text-center">
              <p className="font-mono text-2xl text-accent">✓ you&apos;re in</p>
              <p className="mt-2 text-sm text-muted">Registration confirmed. See you there.</p>
              <button
                onClick={close}
                className="mt-6 rounded bg-accent px-5 py-2 font-mono text-sm font-semibold text-black"
              >
                close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-3">
              <Field label="name" name="name" autoComplete="name" maxLength={80} />
              <Field label="email" name="email" type="email" autoComplete="email" maxLength={100} />
              <Field label="college / year" name="college" placeholder="e.g. ABES, 2nd year" maxLength={100} />
              <Field label="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10 digits" maxLength={15} />

              {error && (
                <p role="alert" className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex-1 rounded bg-accent px-4 py-2 font-mono text-sm font-semibold text-black disabled:opacity-60"
                >
                  {status === "sending" ? "sending..." : "submit"}
                </button>
                <button type="button" onClick={close} className="rounded border border-line px-4 py-2 font-mono text-sm text-muted hover:text-ink">
                  cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}