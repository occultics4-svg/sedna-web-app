import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * Reads cookies via next/headers; refreshes the session through Set-Cookie on responses.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — Next won't let us mutate cookies
            // here. The middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Admin client that bypasses Row Level Security. Use ONLY in server code,
 * never in route handlers that take user input directly. Intended for
 * webhook handlers (e.g. Stripe) that need to mutate other users' rows.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // We don't need cookie handling for the service-role client.
  return createServerClient(url, serviceKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
