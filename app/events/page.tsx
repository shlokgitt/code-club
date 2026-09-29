import { getEvents } from "@/lib/events";
import EventBrowser from "@/components/EventBrowser";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="font-mono text-3xl font-bold">
        <span className="text-accent">$</span> ls events
      </h1>
      <p className="mt-2 text-muted">Search by name or filter by category.</p>
      <div className="mt-8">
        <EventBrowser events={events} />
      </div>
    </main>
  );
}