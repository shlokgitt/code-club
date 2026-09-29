import { CATEGORIES } from "./types";

const s = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export type EventInput = {
  name: string; category: string; venue: string; description: string;
  capacity: number; featured: boolean; date: Date;
};
type Parsed = { ok: true; data: EventInput } | { ok: false; error: string };

export function parseEvent(b: Record<string, unknown>): Parsed {
  const data: EventInput = {
    name: s(b.name, 100),
    category: s(b.category, 30),
    venue: s(b.venue, 100),
    description: s(b.description, 500),
    capacity: Number(b.capacity),
    featured: b.featured === true,
    date: new Date(`${s(b.date, 16)}+05:30`), // admin enters IST
  };
  if (!data.name || !data.venue || !data.description)
    return { ok: false, error: "Name, venue and description are required." };
  if (!(CATEGORIES as readonly string[]).includes(data.category))
    return { ok: false, error: "Invalid category." };
  if (isNaN(data.date.getTime())) return { ok: false, error: "Invalid date." };
  if (!Number.isInteger(data.capacity) || data.capacity < 1 || data.capacity > 10000)
    return { ok: false, error: "Capacity must be a whole number from 1 to 10000." };
  return { ok: true, data };
}