const FAQS = [
  { q: "Who can join CodeClub?", a: "Anyone at the college with an interest in building things — any year, any branch, any skill level. You don't need prior experience." },
  { q: "Is there a membership fee?", a: "No, joining and attending events is free." },
  { q: "Do I need a team to register for events?", a: "Depends on the event. Workshops and talks are solo. Hackathons usually allow teams of 1 to 4 — check each event's description." },
  { q: "How do I find out about new events?", a: "New events show up on the Events page as soon as they're added. Follow our socials for announcements too." },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <h2 className="font-mono text-sm text-accent">// faq</h2>
      <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-panel">
        {FAQS.map((f) => (
          <details key={f.q} className="group p-5 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {f.q}
              <span className="font-mono text-accent transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
