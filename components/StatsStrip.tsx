const STATS = [
  { value: "40+", label: "members" },
  { value: "12", label: "events run" },
  { value: "4", label: "hackathons" },
  { value: "100%", label: "free to join" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-line bg-panel">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-mono text-2xl font-bold text-accent sm:text-3xl">{s.value}</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
