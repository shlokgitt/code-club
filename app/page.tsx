import Link from "next/link";
import { getEvents } from "@/lib/events";
import { fmtDate, fmtTime } from "@/lib/format";
import EventCard from "@/components/EventCard";
import RegisterButton from "@/components/RegisterButton";
import AboutEventButton from "@/components/AboutEventButton";
import Countdown from "@/components/Countdown";
import StatsStrip from "@/components/StatsStrip";
import Faq from "@/components/Faq";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getEvents();
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = all.filter((e) => new Date(e.date).getTime() >= now);
  const featured = upcoming.find((e) => e.featured) ?? upcoming[0];
  const rest = upcoming.filter((e) => e.id !== featured?.id).slice(0, 3);

  return (
    <main>
      <section className="mx-auto max-w-5xl px-5 pb-10 pt-16">
        <p className="font-mono text-sm text-accent">{"// student developer community"}</p>
        <h1 className="mt-3 max-w-2xl font-display text-5xl leading-none sm:text-7xl">
          Build. Compete. <span className="text-accent">Ship.</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted">
          We are a student community of developers. We run workshops, hackathons and talks, and we help each other
          get better at building things. Every skill level is welcome.
        </p>
        <Link
          href="/events"
          className="mt-8 inline-block rounded bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-black hover:opacity-90"
        >
          browse events
        </Link>
      </section>

      <StatsStrip />

      {featured && (
        <section className="mx-auto max-w-5xl px-5 py-8">
          <h2 className="font-mono text-sm text-accent">{"// featured"}</h2>
          <div className="mt-3 grid gap-6 rounded-lg border border-accent/50 bg-panel p-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <span className="rounded border border-accent/40 px-2 py-0.5 font-mono text-xs text-accent">
                {featured.category}
              </span>
              <h3 className="mt-3 text-2xl font-bold">{featured.name}</h3>
              <p className="mt-2 max-w-xl text-muted">{featured.description}</p>
              <p className="mt-4 font-mono text-sm text-muted">
                {fmtDate(featured.date)} · {fmtTime(featured.date)} · {featured.venue}
              </p>
              <div className="mt-5"><Countdown iso={featured.date} /></div>
            </div>
            <div className="flex flex-col gap-3">
              <RegisterButton event={featured} />
              <AboutEventButton description={featured.description} />
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-5 py-8 pb-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-sm text-accent">{"// upcoming"}</h2>
          <Link href="/events" className="font-mono text-xs text-muted hover:text-ink">
            all events →
          </Link>
        </div>
        {rest.length ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="mt-3 font-mono text-sm text-muted">no other upcoming events yet.</p>
        )}
      </section>

      <Faq />
    </main>
  );
}