import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  stripe,
  SEDNA_PRICE_IDS,
  tierForPriceId,
} from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendCancellationEmail,
  sendPaymentFailedEmail,
} from "@/lib/email";

/**
 * Stripe webhook handler.
 *
 * IMPORTANT: this route must NOT be processed by the Next middleware that
 * parses cookies/refreshes the Supabase session, because the request body
 * must remain UNREAD (raw text) for signature verification. The middleware
 * matcher in /middleware.ts already excludes this path.
 *
 * In the Stripe account this app shares with Adriana's other products, we
 * filter events by SEDNA_PRICE_IDS so events for other products do not
 * touch our DB. Subscriptions / customers from other apps are silently
 * ignored.
 */

// Tell Next that this route reads the raw request body.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "missing_signature_or_secret" },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return NextResponse.json(
      { error: "signature_verification_failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await onCheckoutCompleted(event.data.object);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await onSubscriptionChanged(event.data.object);
        break;
      }
      case "customer.subscription.deleted": {
        await onSubscriptionDeleted(event.data.object);
        break;
      }
      case "invoice.payment_failed": {
        await onPaymentFailed(event.data.object);
        break;
      }
      default:
        // Ignore other event types. Stripe sends many we do not care about.
        break;
    }
  } catch (err) {
    console.error(
      `[stripe/webhook] handler for ${event.type} threw:`,
      err
    );
    // Return 500 so Stripe retries. Webhook handlers must be idempotent.
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Returns the SEDNA user id stored in either the session or subscription
 * metadata, or null if this is not a SEDNA-related event.
 */
function sednaUserIdFrom(
  obj: { metadata?: Stripe.Metadata | null }
): string | null {
  const raw = obj.metadata?.sedna_user_id;
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

function priceIdForSubscription(sub: Stripe.Subscription): string | null {
  const item = sub.items.data[0];
  return item?.price?.id ?? null;
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  // For mode='subscription', the subscription exists by the time this fires
  // and we'll soon get customer.subscription.created / updated as well.
  // We do nothing here except verify it's ours.
  const userId = sednaUserIdFrom(session);
  if (!userId) return; // not a SEDNA checkout
  // The actual upsert into our subscriptions table happens on
  // customer.subscription.created/updated below, which carries the full
  // subscription state including status, trial_end, and current_period_end.
}

async function onSubscriptionChanged(sub: Stripe.Subscription) {
  const userId = sednaUserIdFrom(sub);
  if (!userId) {
    // Not our subscription (could be from one of Adriana's other apps).
    return;
  }

  const priceId = priceIdForSubscription(sub);
  if (!priceId || !SEDNA_PRICE_IDS.has(priceId)) {
    // Defensive: even if metadata is right, double-check the price ID.
    return;
  }

  const tier = tierForPriceId(priceId);
  if (!tier) return;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // In API version 2025+ Stripe moved current_period_end onto subscription
  // items. Read the first item's value (we only ever have a single item).
  const firstItem = sub.items.data[0];
  const currentPeriodEnd = firstItem?.current_period_end ?? null;

  const admin = createAdminClient();

  // Read previous state so we can detect transitions (e.g. user just
  // pressed Cancel in the customer portal → cancel_at_period_end flipped
  // from false to true).
  const { data: previous } = await admin
    .from("subscriptions")
    .select("cancel_at_period_end")
    .eq("user_id", userId)
    .maybeSingle<{ cancel_at_period_end: boolean | null }>();

  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status: sub.status,
      tier,
      trial_end: sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error(
      "[stripe/webhook] subscriptions upsert failed:",
      error
    );
    throw error;
  }

  // Email: user just hit "Cancel" in the portal (transition from
  // cancel=false → cancel=true while sub remains active/trialing).
  // We send the cancellation email NOW (not when the subscription is
  // actually deleted later) so they have time to undo or re-up.
  const wasNotCanceling = previous?.cancel_at_period_end === false;
  const isNowCanceling = sub.cancel_at_period_end === true;
  if (wasNotCanceling && isNowCanceling) {
    const endTs = currentPeriodEnd ?? sub.trial_end;
    const endDate = endTs
      ? new Date(endTs * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "the end of your billing period";
    const email = await emailForUserId(userId);
    if (email) {
      try {
        await sendCancellationEmail(email, endDate);
      } catch (err) {
        console.error("[stripe/webhook] cancellation email failed:", err);
      }
    }
  }
}

/**
 * Look up the user's email from the profiles table. Used to address
 * transactional emails sent in response to Stripe events.
 */
async function emailForUserId(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle<{ email: string | null }>();
  return data?.email ?? null;
}

async function onSubscriptionDeleted(sub: Stripe.Subscription) {
  const userId = sednaUserIdFrom(sub);
  if (!userId) return;

  const priceId = priceIdForSubscription(sub);
  if (!priceId || !SEDNA_PRICE_IDS.has(priceId)) return;

  const admin = createAdminClient();
  // Keep the row for history; just mark status canceled.
  const { error } = await admin
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error(
      "[stripe/webhook] subscriptions cancel update failed:",
      error
    );
    throw error;
  }
}

async function onPaymentFailed(invoice: Stripe.Invoice) {
  // Pull customer + subscription off the invoice and confirm it's ours
  // (SEDNA price). Only email the user on the FIRST failed attempt to
  // avoid spamming when Stripe retries automatically over the next days.
  const attemptCount = invoice.attempt_count ?? 1;
  if (attemptCount > 1) return;

  // In the 2026 Stripe API, the subscription reference moved off the
  // invoice and onto invoice.parent.subscription_details.subscription.
  const parent = invoice.parent;
  const subRef =
    parent?.type === "subscription_details"
      ? parent.subscription_details?.subscription
      : null;
  const subId =
    typeof subRef === "string" ? subRef : (subRef?.id ?? null);
  if (!subId) return;

  let sub: Stripe.Subscription;
  try {
    sub = await stripe.subscriptions.retrieve(subId);
  } catch (err) {
    console.error("[stripe/webhook] failed to fetch sub for invoice:", err);
    return;
  }

  const userId = sednaUserIdFrom(sub);
  if (!userId) return;

  const priceId = priceIdForSubscription(sub);
  if (!priceId || !SEDNA_PRICE_IDS.has(priceId)) return;

  const email = await emailForUserId(userId);
  if (!email) return;

  try {
    await sendPaymentFailedEmail(email);
  } catch (err) {
    console.error("[stripe/webhook] payment-failed email failed:", err);
  }
}
