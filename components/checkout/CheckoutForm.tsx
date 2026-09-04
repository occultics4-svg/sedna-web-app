"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";

export function CheckoutForm() {
  const c = copy.checkout;
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState
    { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed || status.kind === "loading") return;
    setStatus({ kind: "loading" });

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "lifetime" }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus({
          kind: "error",
          message: body.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      const data = (await res.json()) as { url: string };
      // Hand off to Stripe-hosted Checkout.
      window.location.href = data.url;
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-2xl border border-accent bg-accent-soft p-8 text-center">
        <div className="font-serif text-5xl text-text">
          {c.price}
          <span className="text-lg text-text-muted ml-2">{c.per}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-bg-card border border-bg-elev p-6 space-y-4">
        <div className="text-text-muted text-sm font-medium">
          {c.termsHeading}
        </div>
        <ul className="space-y-3 text-text-muted text-sm leading-relaxed">
          {c.termsBullets.map((b, i) => (
            <li key={i}>· {b}</li>
          ))}
        </ul>
        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-bg-elev bg-bg accent-accent shrink-0"
          />
          <span className="text-text text-sm leading-relaxed">
            {c.termsAgreeLabel}
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!agreed || status.kind === "loading"}
        className="w-full px-8 py-4 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status.kind === "loading" ? "Redirecting to Stripe…" : c.cta}
      </button>

      {status.kind === "error" && (
        <p className="text-red-300 text-sm text-center">{status.message}</p>
      )}
    </form>
  );
}
