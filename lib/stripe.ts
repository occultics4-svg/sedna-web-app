import Stripe from "stripe";

/**
 * Server-side Stripe client. Do not import this from "use client" components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Pin to a known API version so behavior is reproducible.
  apiVersion: "2026-05-27.dahlia",
  appInfo: {
    name: "SEDNA",
    url: "https://sedna.occultics.ai",
  },
});

export const PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY!;
export const PRICE_ANNUAL = process.env.STRIPE_PRICE_ANNUAL!;

/**
 * The set of SEDNA-specific Stripe price IDs. The webhook handler uses this
 * to filter events for subscriptions tied to OTHER products in the same
 * Stripe account (since this account hosts Adriana's other apps too).
 */
export const SEDNA_PRICE_IDS = new Set<string>([PRICE_MONTHLY, PRICE_ANNUAL]);

export function tierForPriceId(priceId: string): "monthly" | "annual" | null {
  if (priceId === PRICE_MONTHLY) return "monthly";
  if (priceId === PRICE_ANNUAL) return "annual";
  return null;
}
