import { Resend } from "resend";
import { render } from "@react-email/render";
import { copy } from "@/lib/copy";

/**
 * Resend client. Only call from server code.
 *
 * The `from` address must be on a verified domain in your Resend account.
 * For SEDNA we send from hello@mail.occultics.ai (the mail.occultics.ai
 * subdomain handles SPF + DKIM, while occultics.ai root continues to
 * handle inbound email forwarding to gmail).
 */
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "hello@mail.occultics.ai";

function from(): string {
  return `${copy.emails.fromName} <${FROM_EMAIL}>`;
}

/**
 * Internal helper. Renders a React Email template to HTML+text and sends.
 * Throws on Resend errors so callers (webhook handler, callback) can log.
 */
async function send({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping send for:",
      subject
    );
    return { skipped: true };
  }
  const html = await render(react);
  const text = await render(react, { plainText: true });

  const { data, error } = await resend.emails.send({
    from: from(),
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[email] resend send failed:", { subject, to, error });
    throw new Error(`resend_failed: ${error.message ?? "unknown"}`);
  }

  return { id: data?.id };
}

// Re-export send for direct use by templates we build below.
export { send as sendEmail };

// ─── named senders (use these from the rest of the app) ──────────────────

import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { TrialEndingEmail } from "@/components/emails/TrialEndingEmail";
import { CancellationEmail } from "@/components/emails/CancellationEmail";
import { PaymentFailedEmail } from "@/components/emails/PaymentFailedEmail";

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function sendWelcomeEmail(to: string) {
  return send({
    to,
    subject: copy.emails.welcome.subject,
    react: WelcomeEmail({ appUrl: appUrl() }),
  });
}

export async function sendTrialEndingEmail(to: string) {
  return send({
    to,
    subject: copy.emails.trialEnding.subject,
    react: TrialEndingEmail({ appUrl: appUrl() }),
  });
}

export async function sendCancellationEmail(to: string, endDate: string) {
  return send({
    to,
    subject: copy.emails.cancellation.subject,
    react: CancellationEmail({ appUrl: appUrl(), endDate }),
  });
}

export async function sendPaymentFailedEmail(to: string) {
  return send({
    to,
    subject: copy.emails.paymentFailed.subject,
    react: PaymentFailedEmail({ appUrl: appUrl() }),
  });
}
