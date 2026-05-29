import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * Handles the redirect from a magic-link email. The link looks like:
 *   /auth/callback?code=PKCE_CODE&next=/account
 *
 * On success: exchanges the code for a session, ensures a profiles row exists
 * for the user, sends a welcome email if it's their first time, and redirects
 * to `next` (defaults to /account).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";

  if (!code) {
    return NextResponse.redirect(
      new URL("/account?error=missing_code", url.origin)
    );
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/account?error=${encodeURIComponent(error.message)}`,
        url.origin
      )
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const admin = createAdminClient();

    // Was this user's profile already on file? If not, this is their first
    // sign-in and we send the welcome email after the upsert.
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle<{ id: string }>();
    const isFirstSignIn = !existingProfile;

    const { error: upsertError } = await admin
      .from("profiles")
      .upsert(
        { id: user.id, email: user.email },
        { onConflict: "id", ignoreDuplicates: false }
      );
    if (upsertError) {
      console.error("[/auth/callback] profile upsert failed:", {
        user_id: user.id,
        error_code: upsertError.code,
        error_message: upsertError.message,
        error_hint: upsertError.hint,
      });
    }

    if (isFirstSignIn && user.email) {
      // Fire-and-forget: don't block the redirect on email send.
      // Errors are logged inside sendWelcomeEmail.
      sendWelcomeEmail(user.email).catch((err) => {
        console.error("[/auth/callback] welcome email failed:", err);
      });
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
