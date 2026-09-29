"use client";
import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) return <div className="h-14" aria-hidden />;

  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return <p className="font-mono text-sm text-accent">● happening now</p>;

  const s = Math.floor(diff / 1000);
  const parts = [
    { v: Math.floor(s / 86400), l: "days" },
    { v: Math.floor((s % 86400) / 3600), l: "hrs" },
    { v: Math.floor((s % 3600) / 60), l: "min" },
    { v: s % 60, l: "sec" },
  ];

  return (
    <div role="timer" className="flex gap-3">
      {parts.map((p) => (
        <div key={p.l} className="min-w-14 rounded border border-line bg-bg px-3 py-2 text-center">
          <div className="font-mono text-xl font-bold text-accent">{pad(p.v)}</div>
          <div className="font-mono text-[10px] uppercase text-muted">{p.l}</div>
        </div>
      ))}
    </div>
  );
}
