import prisma from "./prisma";

const MAX = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function clientKey(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
}

export async function isBlocked(key: string) {
  const row = await prisma.loginAttempt.findUnique({ where: { key } });
  return !!row && row.resetAt > new Date() && row.count >= MAX;
}

export async function recordFailure(key: string) {
  const now = new Date();
  const row = await prisma.loginAttempt.findUnique({ where: { key } });
  if (!row || row.resetAt <= now) {
    const resetAt = new Date(now.getTime() + WINDOW_MS);
    await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    });
  } else {
    await prisma.loginAttempt.update({ where: { key }, data: { count: { increment: 1 } } });
  }
}

export const clearFailures = (key: string) =>
  prisma.loginAttempt.deleteMany({ where: { key } });
