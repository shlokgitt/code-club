"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    setBusy(false);
    if (!res) return setError("Network error.");
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Login failed.");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-mono text-2xl font-bold"><span className="text-accent">$</span> sudo login</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          name="password" type="password" required autoFocus placeholder="admin password"
          className="w-full rounded border border-line bg-panel px-3 py-2 font-mono text-sm outline-none focus:border-accent"
        />
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="w-full rounded bg-accent px-4 py-2 font-mono text-sm font-semibold text-black disabled:opacity-60">
          {busy ? "checking..." : "login"}
        </button>
      </form>
    </main>
  );
}