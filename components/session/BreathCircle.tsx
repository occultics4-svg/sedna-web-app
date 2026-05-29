"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";

const CYCLE_MS = 14_000; // 5 inhale + 2 hold + 7 exhale
const TOTAL_CYCLES = 3;

type Phase = "inhale" | "hold" | "exhale";

function phaseFor(elapsed: number): Phase {
  if (elapsed < 5000) return "inhale";
  if (elapsed < 7000) return "hold";
  return "exhale";
}

export function BreathCircle({ onComplete }: { onComplete?: () => void }) {
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>("inhale");
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const start = startRef.current ?? now;
      const elapsed = (now - start) % CYCLE_MS;
      const cycleIndex = Math.floor((now - start) / CYCLE_MS);
      setPhase(phaseFor(elapsed));
      setCycle(cycleIndex);
      if (cycleIndex >= TOTAL_CYCLES) {
        setRunning(false);
        onComplete?.();
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [running, onComplete]);

  const visibleCycle = Math.min(cycle + 1, TOTAL_CYCLES);
  const phaseLabel = copy.breath[phase];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <button
        type="button"
        aria-label={running ? "Breathing" : copy.breath.tapToStart}
        onClick={() => !running && setRunning(true)}
        className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-accent-soft border border-accent/50 flex items-center justify-center focus:outline-none"
      >
        <span
          key={running ? "on" : "off"}
          className={[
            "block w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-accent/30",
            running ? "breath-circle" : "",
          ].join(" ")}
          style={{
            transform: running ? undefined : "scale(0.6)",
            animationIterationCount: TOTAL_CYCLES,
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-text font-serif text-lg pointer-events-none">
          {running ? phaseLabel : copy.breath.tapToStart}
        </span>
      </button>
      <div className="text-text-muted text-sm">
        {running
          ? copy.breath.countLabel(visibleCycle, TOTAL_CYCLES)
          : copy.breath.instructions(TOTAL_CYCLES)}
      </div>
    </div>
  );
}
