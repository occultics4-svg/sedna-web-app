import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSubscription, isPaid } from "@/lib/subscription";
import { Footer } from "@/components/Footer";
import { SignInForm } from "@/components/account/SignInForm";
import { SignOutButton } from "@/components/account/SignOutButton";
import { ManageSubscriptionButton } from "@/components/account/ManageSubscriptionButton";
import { copy } from "@/lib/copy";

export const dynamic = "force-dynamic";

type SessionRow = {
  id: string;
  problem: string;
  becoming: string | null;
  created_at: string;
};

type SearchParams = {
  error?: string;
  checkout?: string;
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      <header className="max-w-3xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          {copy.site.brand}
        </Link>
        <Link
          href="/app"
          className="text-text-muted text-sm hover:text-text"
        >
          Practice
        </Link>
      </header>

      <section className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        {!user ? (
          <SignedOutView error={searchParams.error} />
        ) : (
          <SignedInView
            userEmail={user.email ?? ""}
            userId={user.id}
            justCheckedOut={searchParams.checkout === "success"}
          />
        )}
      </section>

      <Footer />
    </main>
  );
}

function SignedOutView({ error }: { error?: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl">Sign in</h1>
        <p className="text-text-muted leading-relaxed">
          Sign in to save your sessions across devices and see your patterns
          over time.
        </p>
      </div>
      {error && (
        <div className="rounded-xl bg-red-950/40 border border-red-900/50 px-4 py-3 text-red-200 text-sm">
          {error}
        </div>
      )}
      <SignInForm />
    </div>
  );
}

async function SignedInView({
  userEmail,
  userId,
  justCheckedOut,
}: {
  userEmail: string;
  userId: string;
  justCheckedOut: boolean;
}) {
  const sub = await getCurrentSubscription();
  const paid = isPaid(sub);

  return (
    <div className="space-y-8">
      {justCheckedOut && (
        <div className="rounded-xl bg-accent-soft border border-accent/40 px-5 py-4">
          <div className="text-accent font-serif text-lg">
            Welcome to SEDNA.
          </div>
          <p className="text-text-muted text-sm mt-1">
            Your 3-day free trial is active. Your sessions will now save here.
          </p>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Your account</h1>
          <p className="text-text-muted text-sm mt-1">{userEmail}</p>
        </div>
        <SignOutButton />
      </div>

      {paid ? (
        <SubscribedAccount sub={sub!} userId={userId} />
      ) : (
        <NotSubscribedAccount status={sub?.status ?? null} />
      )}
    </div>
  );
}

function NotSubscribedAccount({ status }: { status: string | null }) {
  // status null => never subscribed
  // status canceled / unpaid => was subscribed, now lapsed
  const wasSubscribed = status !== null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-bg-card border border-bg-elev p-8 space-y-5">
        <div className="space-y-2">
          <div className="text-accent text-xs uppercase tracking-[0.25em]">
            {wasSubscribed ? "Subscription ended" : "Not subscribed yet"}
          </div>
          <h2 className="font-serif text-2xl">
            {wasSubscribed
              ? "Resume saving your sessions"
              : "Save your sessions across devices"}
          </h2>
          <p className="text-text-muted leading-relaxed">
            Start your 3-day free trial. $14.99/month or $89/year. Cancel
            anytime in your account.
          </p>
        </div>
        <Link
          href="/checkout"
          className="inline-block px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
        >
          Start 3-day free trial
        </Link>
      </div>

      <div className="rounded-2xl bg-bg-card border border-bg-elev p-6 space-y-2">
        <div className="font-serif text-lg">Want to use SEDNA anyway?</div>
        <p className="text-text-muted text-sm leading-relaxed">
          You can complete unlimited sessions in the practice. They will save
          to this device&apos;s browser only — not synced across devices, and
          not shown here. Free forever.
        </p>
        <Link
          href="/app"
          className="inline-block text-accent hover:text-accent-hover text-sm pt-2"
        >
          Open the practice →
        </Link>
      </div>
    </div>
  );
}

async function SubscribedAccount({
  sub,
  userId,
}: {
  sub: {
    status: string;
    tier: "monthly" | "annual";
    trial_end: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  };
  userId: string;
}) {
  const supabase = createClient();
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, problem, becoming, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const list: SessionRow[] = sessions ?? [];

  const onTrial = sub.status === "trialing";
  const trialEndsAt = onTrial && sub.trial_end ? new Date(sub.trial_end) : null;
  const renewsAt =
    !onTrial && sub.current_period_end
      ? new Date(sub.current_period_end)
      : null;

  return (
    <div className="space-y-10">
      <div className="rounded-2xl bg-bg-card border border-bg-elev p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="text-accent text-xs uppercase tracking-[0.25em]">
            {onTrial ? "Free trial" : `${sub.tier} plan`}
          </div>
          <div className="text-text-muted text-sm">
            {onTrial && trialEndsAt
              ? `Trial ends ${trialEndsAt.toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}. ${sub.cancel_at_period_end ? "Will not renew." : "Renews automatically."}`
              : sub.cancel_at_period_end
                ? `Access continues until ${renewsAt?.toLocaleDateString(undefined, { dateStyle: "medium" }) ?? "period end"}, then ends.`
                : `Renews ${renewsAt?.toLocaleDateString(undefined, { dateStyle: "medium" }) ?? "automatically"}.`}
          </div>
        </div>
        <ManageSubscriptionButton />
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-2xl">Your sessions</h2>
        {list.length === 0 ? (
          <div className="rounded-2xl bg-bg-card border border-bg-elev p-8 text-center space-y-4">
            <p className="text-text-muted leading-relaxed">
              No sessions yet. The next time you complete a practice while
              signed in, it will appear here.
            </p>
            <Link
              href="/app"
              className="inline-block px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
            >
              Start a session
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl bg-bg-card border border-bg-elev p-5 hover:border-accent/40 transition"
              >
                <Link href={`/account/sessions/${s.id}`} className="block">
                  <div className="text-text font-serif text-lg leading-snug line-clamp-2">
                    {s.problem}
                  </div>
                  {s.becoming && (
                    <div className="text-text-muted text-sm mt-2 italic line-clamp-1">
                      becoming: {s.becoming}
                    </div>
                  )}
                  <div className="text-text-hint text-xs mt-3">
                    {new Date(s.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 border-t border-bg-elev">
        <p className="text-text-hint text-xs">
          User ID: <span className="font-mono">{userId.slice(0, 8)}…</span>
        </p>
      </div>
    </div>
  );
}
