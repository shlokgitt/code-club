import type { EventDTO } from "@/lib/types";
import Link from "next/link";
import { fmtDate, fmtTime } from "@/lib/format";
import RegisterButton from "./RegisterButton";

export default function EventCard({ event }: { event: EventDTO }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-line bg-panel p-5 transition hover:border-accent/60">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="rounded border border-accent/40 px-2 py-0.5 text-accent">{event.category}</span>
        <span className={event.spotsLeft <= 10 ? "text-red-400" : "text-muted"}>
          {event.spotsLeft > 0 ? `${event.spotsLeft} spots left` : "full"}
        </span>
      </div>
      <Link href={`/events/${event.id}`} className="text-lg font-semibold hover:text-accent transition">{event.name}</Link>
      <p className="text-sm text-muted">{event.description}</p>
      <div className="mt-auto space-y-1 pt-2 font-mono text-xs text-muted">
        <div><span className="text-accent">when</span>  {fmtDate(event.date)} · {fmtTime(event.date)}</div>
        <div><span className="text-accent">where</span> {event.venue}</div>
      </div>
      <RegisterButton event={event} />
    </article>
  );
}