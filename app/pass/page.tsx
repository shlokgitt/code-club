export const metadata = { title: "My Pass · CodeClub" };

export default function PassPage() {
  return (
    <main className="mx-auto max-w-lg px-5 py-16 pb-20 text-center">
      <div className="text-5xl">🎟</div>
      <h1 className="mt-4 font-display text-3xl">Your Pass</h1>
      <p className="mt-3 text-muted">
        Your event passes will appear here after you register for an event.
      </p>
      <div className="mx-auto mt-8 max-w-xs rounded-xl border border-dashed border-line bg-panel p-8">
        <p className="font-mono text-xs text-muted">no active passes</p>
      </div>
    </main>
  );
}
