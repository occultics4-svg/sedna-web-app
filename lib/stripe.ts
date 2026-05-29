import Stripe from "stripe";

/**
 * Server-side Stripe client. Do not import this from "use client" components.
 *
 * Lazy-initialized so Next.js build-time module analysis doesn't crash when
 * STRIPE_SECRET_KEY is missing (e.g. on first deploy to a fresh Vercel
 * project before env vars are configured). Actual API calls fail at runtime
 * if the env var is genuinely missing, which is the right place to fail.
 */
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2026-05-27.dahlia",
    appInfo: {
      name: "SEDNA",
      url: "https://sedna.occultics.ai",
    },
  });
  return _stripe;
}

/**
 * Proxy that defers Stripe client construction until first property access.
 * Existing callers (`stripe.customers.create(...)`) keep working unchanged.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const s = getStripe();
    const value = s[prop as keyof Stripe];
    return typeof value === "function" ? value.bind(s) : value;
  },
});

export const PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY ?? "";
export const PRICE_ANNUAL = process.env.STRIPE_PRICE_ANNUAL ?? "";

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
