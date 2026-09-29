"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/events", label: "Events", icon: "▦" },
  { href: "/pass", label: "Pass", icon: "⎙" },
  { href: "/admin", label: "Admin", icon: "⚙" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-bg/95 backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-center transition ${active ? "text-accent" : "text-muted"}`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="font-mono text-[10px]">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
