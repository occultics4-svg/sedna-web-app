/**
 * DEV-ONLY route — sends a real welcome email to the currently signed-in
 * user. Used once during phase 2.3 to verify the Resend integration
 * produces a correctly styled, deliverable email.
 *
 * Delete this file before deploying to production.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json(
      { error: "Sign in first at /account, then visit this URL again." },
      { status: 401 }
    );
  }

  try {
    const result = await sendWelcomeEmail(user.email);
    return NextResponse.json({
      ok: true,
      sent_to: user.email,
      resend_id: result?.id ?? null,
      skipped: result?.skipped ?? false,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "send_failed",
      },
      { status: 500 }
    );
  }
}
