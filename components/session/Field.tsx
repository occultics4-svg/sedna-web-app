"use client";

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  examples?: readonly string[];
  rows?: number;
  autoFocus?: boolean;
};

export function Field({
  label,
  value,
  onChange,
  placeholder,
  examples,
  rows = 4,
  autoFocus,
}: FieldProps) {
  return (
    <div className="space-y-3">
      <label className="block text-text-muted text-sm">{label}</label>
      {examples && examples.length > 0 && (
        <div className="rounded-xl bg-accent-soft border border-accent/20 px-4 py-3 space-y-2">
          <div className="text-accent text-[10px] uppercase tracking-[0.25em]">
            For example
          </div>
          <ul className="space-y-1 text-text-muted text-sm italic leading-relaxed">
            {examples.map((ex, i) => (
              <li key={i}>— {ex}</li>
            ))}
          </ul>
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        className="w-full rounded-xl bg-bg-card border border-bg-elev focus:border-accent focus:outline-none px-4 py-3 text-text placeholder:text-text-hint resize-none transition"
      />
    </div>
  );
}

type ChipsProps = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
};

export function Chips({ label, options, value, onChange }: ChipsProps) {
  return (
    <div className="space-y-2">
      <label className="block text-text-muted text-sm">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(selected ? "" : opt)}
              className={[
                "px-4 py-2 rounded-full border text-sm transition",
                selected
                  ? "bg-accent text-bg border-accent"
                  : "bg-bg-card border-bg-elev text-text-muted hover:border-accent hover:text-text",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
