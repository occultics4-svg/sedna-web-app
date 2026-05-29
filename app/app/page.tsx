import Link from "next/link";
import { Wizard } from "@/components/session/Wizard";
import { Disclaimer } from "@/components/Disclaimer";
import { copy } from "@/lib/copy";

export default function AppPage() {
  return (
    <main className="min-h-screen">
      <header className="max-w-2xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-wide">
          {copy.site.brand}
        </Link>
        <Link
          href="/account"
          className="text-text-muted text-sm hover:text-text"
        >
          {copy.wizard.accountLink}
        </Link>
      </header>
      <Wizard />
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <Disclaimer />
      </div>
    </main>
  );
}
