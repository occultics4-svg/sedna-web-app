import { copy } from "@/lib/copy";

export function Disclaimer() {
  return (
    <p className="text-text-hint text-xs leading-relaxed max-w-2xl mx-auto text-center">
      {copy.disclaimer}
    </p>
  );
}
