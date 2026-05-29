import Link from "next/link";
import { Disclaimer } from "./Disclaimer";
import { copy } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="border-t border-bg-elev mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-text-muted text-sm">
          <div>
            <div className="font-serif text-text text-lg">{copy.site.brand}</div>
            <div className="text-text-hint text-xs mt-1">
              {copy.footer.brandLine}
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 -mx-2">
            <Link href="/" className="px-2 py-2 hover:text-text">{copy.footer.nav.home}</Link>
            <Link href="/app" className="px-2 py-2 hover:text-text">{copy.footer.nav.practice}</Link>
            <Link href="/account" className="px-2 py-2 hover:text-text">{copy.footer.nav.account}</Link>
            <Link href="/terms" className="px-2 py-2 hover:text-text">{copy.footer.nav.terms}</Link>
          </nav>
        </div>
        <Disclaimer />
      </div>
    </footer>
  );
}
