# SEDNA

Energetic charge release technique — a 10-minute web practice for the moment after something just got loud.

Brand: Occultics. Domain: sedna.occultics.ai.

## Current state

This commit contains:

- `/` — landing page (hero, pitch, how it works, pricing, founder, footer)
- `/app` — 9-screen session flow with breath circle, PNG share card, and `localStorage` persistence

Not yet wired (deferred until the user confirms):

- Supabase auth + cross-device session storage
- Stripe Checkout, webhook, customer portal
- `/account` page
- `/checkout` page (currently `/checkout` only exists as a link target)
- Resend transactional email
- Cloudflare Web Analytics tag

`supabase/schema.sql` contains the database schema ready to paste into a fresh Supabase project.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The session flow at `/app` works fully offline — drafts and history live in `localStorage` under `sedna:draft` and `sedna:history`. No external services need to be configured to use it.

## Environment

Copy `.env.example` to `.env.local` and fill values once you are ready to wire Supabase + Stripe + Resend. The current code does not yet read any of these.

## Stack

- Next.js 14 App Router, TypeScript strict, Tailwind CSS
- Supabase (deferred), Stripe (deferred), Resend (deferred)
- Target deployment: Cloudflare Pages
