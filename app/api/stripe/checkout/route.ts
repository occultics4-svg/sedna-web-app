import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  stripe,
  PRICE_MONTHLY,
  PRICE_ANNUAL,
  PRICE_LIFETIME,
} from "@/lib/stripe";

const BodySchema = z.object({
  tier: z.enum(["monthly", "annual", "lifetime"]),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_tier" }, { status: 400 });
  }

  const tier = parsed.data.tier;
  const priceId =
    tier === "monthly"
      ? PRICE_MONTHLY
      : tier === "annual"
        ? PRICE_ANNUAL
        : PRICE_LIFETIME;

  // Fail loudly and clearly if the matching Stripe price env var isn't set,
  // instead of letting an empty string reach Stripe's API and come back as
  // an opaque 500. (This was the confirmed root cause of checkout failing
  // for monthly/annual: STRIPE_PRICE_MONTHLY / STRIPE_PRICE_ANNUAL were not
  // set in the Vercel production environment.)
  if (!priceId) {
    console.error(
      `[checkout] Missing Stripe price id for tier "${tier}". Set ` +
        "STRIPE_PRICE_MONTHLY / STRIPE_PRICE_ANNUAL / STRIPE_PRICE_LIFETIME " +
        "in the Vercel project's Environment Variables (Production), then redeploy."
    );
    return NextResponse.json(
      { error: "price_not_configured" },
      { status: 500 }
    );
  }

  try {
    // Look up any existing Stripe customer for this user. We store
    // stripe_customer_id in our subscriptions table after first checkout,
    // and re-use it on subsequent checkouts so the same Stripe customer
    // accrues all of this user's payment history.
    const admin = createAdminClient();
    const { data: existingSub } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle<{ stripe_customer_id: string | null }>();

    let customerId = existingSub?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { sedna_user_id: user.id },
      });
      customerId = customer.id;
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const isLifetime = tier === "lifetime";

    const session = await stripe.checkout.sessions.create({
      // Lifetime is a one-time charge, not a recurring subscription.
      mode: isLifetime ? "payment" : "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(isLifetime
        ? {}
        : {
            subscription_data: {
              trial_period_days: 3,
              metadata: {
                sedna_user_id: user.id,
                sedna_tier: tier,
              },
            },
          }),
      metadata: {
        sedna_user_id: user.id,
        sedna_tier: tier,
      },
      success_url: `${appUrl}/account?checkout=success`,
      cancel_url: `${appUrl}/checkout?canceled=1`,
      // Required for some EU/UK setups; harmless elsewhere.
      billing_address_collection: "auto",
      allow_promotion_codes: false,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "stripe_no_url" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Surface the real Stripe/Supabase error in the server logs (Vercel
    // Runtime Logs) instead of failing silently with a bare, unexplained 500.
    console.error("[checkout] Failed to create checkout session:", err);
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "checkout_failed", message },
      { status: 500 }
    );
  }
}
