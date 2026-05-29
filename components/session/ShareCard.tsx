"use client";

import { useRef } from "react";
import { copy } from "@/lib/copy";

type Props = {
  becoming: string;
};

export function ShareCard({ becoming }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  function downloadPng() {
    const node = cardRef.current;
    if (!node) return;
    const w = 1080;
    const h = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0d2540";
    ctx.fillRect(0, 0, w, h);

    // Subtle accent halo
    const radial = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 800);
    radial.addColorStop(0, "rgba(224,184,144,0.18)");
    radial.addColorStop(1, "rgba(13,37,64,0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";

    // Prefix
    ctx.fillStyle = "#e0b890";
    ctx.font = "italic 44px Georgia, serif";
    ctx.fillText(copy.shareCard.prefix, w / 2, 360);

    // Becoming statement, wrapped
    ctx.fillStyle = "#f0ebe1";
    ctx.font = "56px Georgia, serif";
    const words = becoming.split(/\s+/).filter(Boolean);
    const maxWidth = w - 200;
    const lineHeight = 78;
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const startY = 460;
    lines.forEach((l, i) => ctx.fillText(l, w / 2, startY + i * lineHeight));

    // Footer
    ctx.fillStyle = "#a8b8c5";
    ctx.font = "28px Georgia, serif";
    ctx.fillText(copy.shareCard.footer, w / 2, h - 120);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "sedna-becoming.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="space-y-6">
      <div
        ref={cardRef}
        className="aspect-[4/5] rounded-2xl bg-bg-card border border-bg-elev relative overflow-hidden p-8 sm:p-12 flex flex-col items-center justify-center text-center"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side at 50% 50%, rgba(224,184,144,0.18), rgba(13,37,64,0) 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="font-serif italic text-accent text-lg sm:text-xl">
            {copy.shareCard.prefix}
          </div>
          <div className="font-serif text-2xl sm:text-3xl leading-snug text-text">
            {becoming || "…"}
          </div>
          <div className="text-text-muted text-xs tracking-[0.25em] mt-6">
            {copy.shareCard.footer}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={downloadPng}
        disabled={!becoming.trim()}
        className="w-full px-6 py-3 rounded-full bg-accent text-bg font-medium hover:bg-accent-hover transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copy.shareCard.saveCta}
      </button>
    </div>
  );
}
