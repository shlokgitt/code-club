"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/events", label: "events" },
  { href: "/admin", label: "admin" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-mono text-lg font-bold">
          <span className="text-accent">&gt;</span> codeclub<span className="animate-pulse text-accent">_</span>
        </Link>
        <nav className="flex gap-5 font-mono text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "text-accent" : "text-muted hover:text-ink"}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}