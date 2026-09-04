import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle<{ stripe_customer_id: string | null }>();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "no_customer" }, { status: 404 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/account`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    // Surface the real Stripe error in the server logs (Vercel Runtime Logs)
    // instead of failing silently with a bare, unexplained 500. The two most
    // likely causes for this specific route:
    //   1. The Stripe Customer Portal has never been activated/configured for
    //      this Stripe account: Dashboard -> Settings -> Billing -> Customer
    //      portal -> Activate/save a configuration. Very common to miss on a
    //      first live integration -- the API refuses to create sessions until
    //      this has been done at least once.
    //   2. sub.stripe_customer_id was created in a different Stripe mode
    //      (test vs. live) than the currently configured STRIPE_SECRET_KEY,
    //      so Stripe can't find that customer ("No such customer: ...").
    console.error("[portal] Failed to create billing portal session:", err);
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "portal_failed", message },
      { status: 500 }
    );
  }
}
