import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendTrialEndingEmail } from "@/lib/email";

/**
 * Cron endpoint: finds users whose trial ends in the next 24 hours and
 * sends the trial-ending email. Idempotent — uses the
 * `trial_ending_email_sent_at` column to avoid re-sending.
 *
 * Schedule: invoke this once per hour via Cloudflare Cron Triggers
 * (set up during phase 2.4 deploy).
 *
 * Auth: requires the CRON_SECRET env var as a Bearer token, so random
 * internet visitors can't trigger sends.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "cron_secret_not_configured" },
      { status: 500 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Find trialing subs whose trial_end is within the next 24 hours and
  // who have not yet been emailed.
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: subs, error } = await admin
    .from("subscriptions")
    .select("user_id, trial_end, trial_ending_email_sent_at")
    .eq("status", "trialing")
    .lte("trial_end", in24h.toISOString())
    .gte("trial_end", now.toISOString())
    .is("trial_ending_email_sent_at", null);

  if (error) {
    console.error("[cron/trial-ending] query failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = subs ?? [];
  const results: { user_id: string; ok: boolean; error?: string }[] = [];

  for (const row of rows) {
    const userId = (row as { user_id: string }).user_id;

    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .maybeSingle<{ email: string | null }>();
    const email = profile?.email;
    if (!email) {
      results.push({ user_id: userId, ok: false, error: "no_email" });
      continue;
    }

    try {
      await sendTrialEndingEmail(email);
      await admin
        .from("subscriptions")
        .update({ trial_ending_email_sent_at: new Date().toISOString() })
        .eq("user_id", userId);
      results.push({ user_id: userId, ok: true });
    } catch (err) {
      results.push({
        user_id: userId,
        ok: false,
        error: err instanceof Error ? err.message : "send_failed",
      });
    }
  }

  return NextResponse.json({ checked: rows.length, results });
}
