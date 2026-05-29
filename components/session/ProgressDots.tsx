type Props = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: Props) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-6"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={[
              "h-2 rounded-full transition-all",
              active ? "w-8 bg-accent" : done ? "w-2 bg-accent/60" : "w-2 bg-bg-elev",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
