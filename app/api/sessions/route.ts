import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSubscription, isPaid } from "@/lib/subscription";
import { z } from "zod";

const SessionInputSchema = z.object({
  problem: z.string().min(1).max(2000),
  belief: z.string().max(2000).optional().nullable(),
  emotion: z.string().max(2000).optional().nullable(),
  body_location: z.string().max(200).optional().nullable(),
  cost: z.string().max(2000).optional().nullable(),
  secondary_gain: z.string().max(2000).optional().nullable(),
  emotion_goal: z.string().max(2000).optional().nullable(),
  becomes_possible: z.string().max(2000).optional().nullable(),
  resolution: z.string().max(2000).optional().nullable(),
  becoming: z.string().max(2000).optional().nullable(),
});

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Paywall: only paid subscribers may persist sessions to the DB.
  // Anonymous and free users save to localStorage in the browser.
  const sub = await getCurrentSubscription();
  if (!isPaid(sub)) {
    return NextResponse.json(
      { error: "subscription_required" },
      { status: 402 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = SessionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id, created_at")
    .maybeSingle();

  if (error) {
    console.error("[/api/sessions POST] insert failed:", {
      user_id: user.id,
      error_code: error.code,
      error_message: error.message,
      error_details: error.details,
      error_hint: error.hint,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("id, problem, becoming, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data ?? [] });
}
