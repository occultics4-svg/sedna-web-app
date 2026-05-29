"use client";

import { useState } from "react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        alert(`Could not open portal: ${body.error ?? `HTTP ${res.status}`}`);
        return;
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (err) {
      alert(
        err instanceof Error
          ? `Could not open portal: ${err.message}`
          : "Could not open portal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="text-text-muted hover:text-text text-sm transition disabled:opacity-40"
    >
      {loading ? "Opening…" : "Manage subscription"}
    </button>
  );
}
