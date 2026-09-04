import { createClient } from "@/lib/supabase/server";

/**
 * Shape of a subscription row as we care about it in the app.
 */
export type SubscriptionState = {
  status: string;
  tier: "monthly" | "annual" | "lifetime";
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

/**
 * The statuses that grant access to paid features (DB-backed session save,
 * /account session list, etc). 'trialing' means the user is on the 3-day
 * free trial — they get full access. 'active' means they're being charged
 * and current. 'past_due' is grace period — we still allow access so the
 * user can update their card via the customer portal. 'lifetime' means a
 * one-time lifetime-access purchase — permanent, no trial, no renewal, and
 * no customer-portal "manage subscription" flow (there's nothing to manage).
 */
export const PAID_STATUSES = new Set<string>([
  "trialing",
  "active",
  "past_due",
  "lifetime",
]);

export function isPaid(sub: SubscriptionState | null): boolean {
  if (!sub) return false;
  return PAID_STATUSES.has(sub.status);
}

/**
 * Fetch the current user's subscription row, if any. Returns null when:
 *   - the user is not signed in
 *   - the user has never started a checkout (no subscriptions row)
 */
export async function getCurrentSubscription(): Promise<SubscriptionState | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("status, tier, trial_end, current_period_end, cancel_at_period_end")
    .eq("user_id", user.id)
    .maybeSingle<SubscriptionState>();

  return data ?? null;
}
