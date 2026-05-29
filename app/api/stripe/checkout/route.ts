import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  stripe,
  PRICE_MONTHLY,
  PRICE_ANNUAL,
} from "@/lib/stripe";

const BodySchema = z.object({
  tier: z.enum(["monthly", "annual"]),
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

  const priceId =
    parsed.data.tier === "monthly" ? PRICE_MONTHLY : PRICE_ANNUAL;

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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 3,
      metadata: {
        sedna_user_id: user.id,
        sedna_tier: parsed.data.tier,
      },
    },
    metadata: {
      sedna_user_id: user.id,
      sedna_tier: parsed.data.tier,
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
}
