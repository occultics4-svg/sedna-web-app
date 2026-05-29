"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use in browser-side code (Client Components).
 * Reads cookies via document.cookie; signs in/out update them automatically.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
