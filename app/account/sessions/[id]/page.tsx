import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/Footer";
import { SignOutButton } from "@/components/account/SignOutButton";
import { copy } from "@/lib/copy";

export const dynamic = "force-dynamic";

type SessionDetail = {
  id: string;
  problem: string;
  belief: string | null;
  emotion: string | null;
  body_location: string | null;
  cost: string | null;
  secondary_gain: string | null;
  emotion_goal: string | null;
  becomes_possible: string | null;
  resolution: string | null;
  becoming: string | null;
  created_at: string;
};

export default async function SessionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-text-muted">Sign in to view this session.</p>
          <Link
            href="/account"
            className="inline-block px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  const { data: session } = await supabase
    .from("sessions")
    .select(
      "id, problem, belief, emotion, body_location, cost, secondary_gain, emotion_goal, becomes_possible, resolution, becoming, created_at"
    )
    .eq("id", params.id)
    .maybeSingle<SessionDetail>();

  if (!session) notFound();

  const fields: { label: string; value: string | null }[] = [
    { label: "The problem", value: session.problem },
    { label: "Belief", value: session.belief },
    { label: "Emotion", value: session.emotion },
    { label: "Body location", value: session.body_location },
    { label: "Cost", value: session.cost },
    { label: "Secondary gain", value: session.secondary_gain },
    { label: "Goal of the emotion", value: session.emotion_goal },
    { label: "What becomes possible", value: session.becomes_possible },
    { label: "Resolution", value: session.resolution },
    { label: "I am becoming", value: session.becoming },
  ];

  return (
    <main className="min-h-screen">
      <header className="max-w-3xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          {copy.site.brand}
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/account"
            className="text-text-muted text-sm hover:text-text"
          >
            ← Back to sessions
          </Link>
          <SignOutButton />
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 pt-12 pb-24 space-y-8">
        <div className="space-y-2">
          <p className="text-text-hint text-xs uppercase tracking-[0.25em]">
            {new Date(session.created_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl leading-snug text-balance">
            {session.problem}
          </h1>
        </div>

        <dl className="space-y-6">
          {fields.slice(1).map((f) =>
            f.value ? (
              <div key={f.label} className="space-y-1">
                <dt className="text-accent text-xs uppercase tracking-[0.2em]">
                  {f.label}
                </dt>
                <dd className="text-text leading-relaxed whitespace-pre-wrap">
                  {f.value}
                </dd>
              </div>
            ) : null
          )}
        </dl>
      </section>

      <Footer />
    </main>
  );
}
