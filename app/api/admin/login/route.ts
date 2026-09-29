import { NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";
import { clientKey, isBlocked, recordFailure, clearFailures } from "@/lib/ratelimit";
import { err } from "@/lib/http";

export async function POST(req: Request) {
  const key = clientKey(req);
  if (await isBlocked(key)) return err("Too many attempts. Try again in 15 minutes.", 429);

  const b = await req.json().catch(() => ({}));
  if (!checkPassword(String(b.password ?? ""))) {
    await recordFailure(key);
    return err("Wrong password.", 401);
  }

  await clearFailures(key);
  await createSession();
  return NextResponse.json({ ok: true });
}