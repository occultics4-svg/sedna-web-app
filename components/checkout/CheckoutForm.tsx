"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";

type Tier = "monthly" | "annual";

export function CheckoutForm() {
  const c = copy.checkout;
  const [tier, setTier] = useState<Tier>("monthly");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<
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
        body: JSON.stringify({ tier }),
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
      <fieldset className="grid sm:grid-cols-2 gap-4">
        <legend className="sr-only">Choose a plan</legend>
        <TierOption
          selected={tier === "monthly"}
          onSelect={() => setTier("monthly")}
          label={c.monthly.label}
          price={c.monthly.price}
          per={c.monthly.per}
        />
        <TierOption
          selected={tier === "annual"}
          onSelect={() => setTier("annual")}
          label={c.annual.label}
          price={c.annual.price}
          per={c.annual.per}
          tag={c.annual.savings}
        />
      </fieldset>

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

function TierOption({
  selected,
  onSelect,
  label,
  price,
  per,
  tag,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  price: string;
  per: string;
  tag?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "text-left rounded-2xl border p-6 transition relative",
        selected
          ? "border-accent bg-accent-soft"
          : "border-bg-elev bg-bg-card hover:border-accent/40",
      ].join(" ")}
    >
      <div className="text-text-muted text-sm uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="font-serif text-3xl text-text">
        {price}
        <span className="text-base text-text-muted">{per}</span>
      </div>
      {tag && (
        <div className="text-accent text-sm mt-2">{tag}</div>
      )}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-3 h-3 text-bg fill-current">
            <path d="M6.4 11.2L3.2 8l1.1-1.1 2.1 2.1 5.3-5.3 1.1 1.1z" />
          </svg>
        </div>
      )}
    </button>
  );
}
