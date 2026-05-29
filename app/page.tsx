import Link from "next/link";
import { Footer } from "@/components/Footer";
import { copy } from "@/lib/copy";

export default function HomePage() {
  const { landing } = copy;
  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-serif text-2xl tracking-wide">
            {copy.site.brand}
          </div>
          <div className="hidden sm:block text-text-hint text-xs uppercase tracking-[0.2em]">
            {copy.site.parentBrand}
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm text-text-muted">
          <Link href="/account" className="hover:text-text">
            {landing.nav.signIn}
          </Link>
          <Link
            href="/checkout"
            className="hidden sm:inline-block px-4 py-2 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
          >
            {landing.nav.startTrialShort}
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="font-serif text-4xl sm:text-6xl leading-tight text-balance">
          {landing.hero.titleLineA}
          <br />
          <span className="text-accent">{landing.hero.titleLineB}</span>
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
          {landing.hero.subline}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="px-8 py-4 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
          >
            {landing.hero.ctaTrial}
          </Link>
          <Link
            href="#how"
            className="px-8 py-4 rounded-full border border-bg-elev text-text hover:bg-bg-card transition"
          >
            {landing.hero.ctaHow}
          </Link>
        </div>
        <p className="mt-6 text-text-hint text-xs">{landing.hero.pricingHint}</p>
      </section>

      {/* Pitch */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-bg-elev">
        <h2 className="font-serif text-2xl sm:text-3xl text-accent mb-6">
          {landing.pitch.heading}
        </h2>
        <div className="space-y-5 text-text-muted leading-relaxed text-lg">
          {landing.pitch.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="max-w-5xl mx-auto px-6 py-16 border-t border-bg-elev"
      >
        <h2 className="font-serif text-2xl sm:text-3xl text-accent mb-12 text-center">
          {landing.how.heading}
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {landing.how.steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl bg-bg-card p-8 border border-bg-elev"
            >
              <div className="text-accent font-serif text-3xl mb-3">{s.n}</div>
              <div className="font-serif text-xl mb-2">{s.title}</div>
              <p className="text-text-muted leading-relaxed text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-bg-elev">
        <h2 className="font-serif text-2xl sm:text-3xl text-accent mb-8 text-center">
          {landing.pricing.heading}
        </h2>
        <div className="rounded-2xl bg-bg-card border border-bg-elev p-8 sm:p-12">
          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-text-muted text-sm uppercase tracking-wider mb-2">
                {landing.pricing.monthlyLabel}
              </div>
              <div className="font-serif text-4xl">
                {landing.pricing.monthlyPrice}
              </div>
              <div className="text-text-hint text-sm mt-1">
                {landing.pricing.monthlyPer}
              </div>
            </div>
            <div>
              <div className="text-text-muted text-sm uppercase tracking-wider mb-2">
                {landing.pricing.annualLabel}
              </div>
              <div className="font-serif text-4xl">
                {landing.pricing.annualPrice}
                <span className="text-xl text-text-muted">
                  {landing.pricing.annualPer}
                </span>
              </div>
              <div className="text-accent text-sm mt-1">
                {landing.pricing.annualSavings}
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-text-muted text-sm mb-8">
            {landing.pricing.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <Link
            href="/checkout"
            className="block w-full text-center px-8 py-4 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition"
          >
            {landing.pricing.cta}
          </Link>
          <p className="text-text-hint text-xs mt-4 text-center">
            {landing.pricing.finePrint}
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-bg-elev">
        <h2 className="font-serif text-2xl sm:text-3xl text-accent mb-6">
          {landing.founder.heading}
        </h2>
        <div className="space-y-5 text-text-muted leading-relaxed">
          {landing.founder.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="text-text-hint text-sm">{landing.founder.byline}</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
