import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { copy } from "@/lib/copy";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      <header className="max-w-3xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide">
          {copy.site.brand}
        </Link>
        <Link
          href={user ? "/account" : "/app"}
          className="text-text-muted text-sm hover:text-text"
        >
          {user ? "Account" : "Practice"}
        </Link>
      </header>

      <section className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center space-y-3 mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl">
            {copy.checkout.title}
          </h1>
          <p className="text-text-muted leading-relaxed">
            {copy.checkout.subtitle}
          </p>
        </div>

        {!user ? (
          <div className="rounded-2xl bg-bg-card border border-bg-elev p-8 text-center space-y-4">
            <p className="text-text-muted leading-relaxed">
              {copy.checkout.signInPrompt}
            </p>
            <Link
              href="/account"
              className="inline-block px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
            >
              {copy.checkout.signInCta}
            </Link>
          </div>
        ) : (
          <CheckoutForm />
        )}
      </section>

      <Footer />
    </main>
  );
}
