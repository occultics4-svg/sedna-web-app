import * as React from "react";
import { copy } from "@/lib/copy";
import { EmailLayout, EmailButton, EmailParagraph } from "./EmailLayout";

export function CancellationEmail({
  appUrl,
  endDate,
}: {
  appUrl: string;
  endDate: string;
}) {
  const c = copy.emails.cancellation;
  return (
    <EmailLayout
      preheader={c.preheader}
      headline={c.headline}
      footerNote={c.footerNote}
    >
      {c.bodyWithEndDate(endDate).map((p, i) => (
        <EmailParagraph key={i}>{p}</EmailParagraph>
      ))}
      <EmailButton href={`${appUrl}/account`}>{c.cta}</EmailButton>
    </EmailLayout>
  );
}
