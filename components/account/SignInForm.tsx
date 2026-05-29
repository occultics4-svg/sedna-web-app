"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "sent"; email: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus({ kind: "loading" });

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus({ kind: "error", message: error.message });
    } else {
      setStatus({ kind: "sent", email: email.trim() });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="rounded-2xl bg-bg-card border border-bg-elev p-8 text-center space-y-3">
        <div className="font-serif text-xl text-accent">Check your email</div>
        <p className="text-text-muted text-sm leading-relaxed">
          We sent a sign-in link to{" "}
          <span className="text-text">{status.email}</span>. Tap it on this
          device to come back here, signed in.
        </p>
        <p className="text-text-hint text-xs">
          Link expires in 10 minutes. Check spam if you don&apos;t see it.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-bg-card border border-bg-elev p-8 space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-text-muted text-sm"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl bg-bg border border-bg-elev focus:border-accent focus:outline-none px-4 py-3 text-text placeholder:text-text-hint transition"
        />
      </div>
      <button
        type="submit"
        disabled={status.kind === "loading" || !email.trim()}
        className="w-full px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status.kind === "loading" ? "Sending…" : "Send me a sign-in link"}
      </button>
      {status.kind === "error" && (
        <p className="text-red-300 text-sm">{status.message}</p>
      )}
      <p className="text-text-hint text-xs leading-relaxed">
        No password. We&apos;ll email you a one-time link. First time signing
        in creates your account.
      </p>
    </form>
  );
}
