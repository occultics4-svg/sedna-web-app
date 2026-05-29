import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { copy } from "@/lib/copy";

/**
 * Shared brand wrapper for every SEDNA transactional email.
 *
 * Design rules (kept email-safe — most clients support a tiny subset of CSS):
 * - Inline colors with hex strings (palette mirrors the app)
 * - Georgia serif for headlines, system sans for body
 * - Max width ~560px; centered
 * - Subtle accent line, no images (keeps emails fast + accessible)
 */
export function EmailLayout({
  preheader,
  headline,
  children,
  footerNote,
}: {
  preheader: string;
  headline: string;
  children: React.ReactNode;
  footerNote: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preheader}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section>
            <Text style={brandStyle}>
              SEDNA
              <span style={brandSmallStyle}> · Occultics</span>
            </Text>
          </Section>

          <Hr style={hrAccentStyle} />

          <Section>
            <Text style={headlineStyle}>{headline}</Text>
          </Section>

          <Section style={{ paddingTop: "8px" }}>{children}</Section>

          <Hr style={hrStyle} />

          <Section>
            <Text style={signatureStyle}>{copy.emails.signature}</Text>
            <Text style={footerStyle}>{footerNote}</Text>
            <Text style={footerStyle}>
              <Link href="https://sedna.occultics.ai" style={footerLinkStyle}>
                sedna.occultics.ai
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/** Branded primary button — render inside the children of EmailLayout. */
export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Section style={{ padding: "16px 0 8px 0" }}>
      <Link href={href} style={buttonStyle}>
        {children}
      </Link>
    </Section>
  );
}

/** Branded paragraph — render inside the children of EmailLayout. */
export function EmailParagraph({ children }: { children: React.ReactNode }) {
  return <Text style={paragraphStyle}>{children}</Text>;
}

// ─── styles ──────────────────────────────────────────────────────────────
// Inlined because most email clients strip <style> tags.

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#0d2540",
  color: "#f0ebe1",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: "32px 16px",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#163252",
  borderRadius: "16px",
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px",
};

const brandStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "20px",
  letterSpacing: "0.05em",
  color: "#f0ebe1",
  margin: 0,
};

const brandSmallStyle: React.CSSProperties = {
  color: "#8295ac",
  fontSize: "11px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

const hrAccentStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid rgba(224, 184, 144, 0.3)",
  margin: "20px 0 24px 0",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #1d4068",
  margin: "28px 0 20px 0",
};

const headlineStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: "26px",
  lineHeight: "1.3",
  color: "#f0ebe1",
  margin: "0 0 4px 0",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: "#a8b8c5",
  margin: "0 0 14px 0",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#e0b890",
  color: "#0d2540",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 28px",
  borderRadius: "999px",
  textDecoration: "none",
};

const signatureStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic",
  fontSize: "14px",
  color: "#e0b890",
  margin: "0 0 16px 0",
};

const footerStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#8295ac",
  margin: "0 0 6px 0",
  lineHeight: "1.5",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#8295ac",
  textDecoration: "underline",
};
