import * as React from "react";
import { copy } from "@/lib/copy";
import { EmailLayout, EmailButton, EmailParagraph } from "./EmailLayout";

export function PaymentFailedEmail({ appUrl }: { appUrl: string }) {
  const c = copy.emails.paymentFailed;
  return (
    <EmailLayout
      preheader={c.preheader}
      headline={c.headline}
      footerNote={c.footerNote}
    >
      {c.body.map((p, i) => (
        <EmailParagraph key={i}>{p}</EmailParagraph>
      ))}
      <EmailButton href={`${appUrl}/account`}>{c.cta}</EmailButton>
    </EmailLayout>
  );
}
