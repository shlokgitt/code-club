import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

const secret = () => process.env.SESSION_SECRET ?? "";
const sign = (payload: string) =>
  crypto.createHmac("sha256", secret()).update(payload).digest("hex");
const digest = (s: string) => crypto.createHash("sha256").update(s).digest();

export function checkPassword(input: string) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || secret().length < 16) return false;
  return crypto.timingSafeEqual(digest(input), digest(real));
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (secret().length < 16) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig) return false;
  const expected = sign(exp);
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return Number(exp) > Date.now();
}