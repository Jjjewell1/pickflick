"use client";

import { useState, useEffect } from "react";

interface HowToModalProps {
  open: boolean;
  onClose: () => void;
}

const DEMO_STEPS = [
  { emoji: "👨‍👩‍👧‍👦", label: "Pick your crew", color: "from-emerald-500/30 to-emerald-900/30" },
  { emoji: "🔀", label: "Shuffle a genre", color: "from-theater-red/30 to-red-900/30" },
  { emoji: "🎬", label: "Nominate movies", color: "from-amber-500/30 to-amber-900/30" },
  { emoji: "🥊", label: "Knockout battles", color: "from-sky-500/30 to-sky-900/30" },
  { emoji: "🎉", label: "Winner!", color: "from-purple-500/30 to-purple-900/30" },
];

function DemoReel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % DEMO_STEPS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const step = DEMO_STEPS[idx];

  return (
    <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-6 border border-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} transition-all duration-500`} />

      {/* Floating popcorn bg */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-lg opacity-20 select-none"
          style={{
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23 + 10) % 80}%`,
            animation: `floatKernel ${5 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        >
          🍿
        </div>
      ))}

      {/* Center emoji */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          key={idx}
          className="text-6xl sm:text-7xl mb-3 animate-scale-in select-none"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
        >
          {step.emoji}
        </span>
        <span
          key={`label-${idx}`}
          className="text-white font-display text-lg sm:text-xl font-bold animate-fade-in-up"
        >
          {step.label}
        </span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {DEMO_STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === idx
                ? "bg-theater-gold w-5"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HowToModal({ open, onClose }: HowToModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative glass-panel-heavy w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          open ? "translate-y-0 sm:scale-100" : "translate-y-8 sm:scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="p-5 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all z-10"
          >
            ✕
          </button>

          {/* Demo reel */}
          <DemoReel />

          {/* Steps as fun infographic cards */}
          <div className="space-y-3">
            <InfoStep
              delay={0}
              emoji="👥"
              title="Add your people"
              desc="Settings → create profiles with emoji + name"
              accent="bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
            />
            <InfoStep
              delay={75}
              emoji="🧔"
              emoji2="👩"
              emoji3="🧒"
              title="Tap who's watching"
              desc="Select participants, hit Continue"
              accent="bg-sky-500/15 text-sky-300 border-sky-500/20"
            />
            <InfoStep
              delay={150}
              emoji="🃏"
              title="Shuffle a genre"
              desc="Cards fly, genre lands. Reshuffle as much as you want!"
              accent="bg-amber-500/15 text-amber-300 border-amber-500/20"
            />
            <InfoStep
              delay={225}
              emoji="🍿"
              title="Everyone nominates"
              desc="Pick 1–2 movies each. Animated handoff between turns."
              accent="bg-theater-red/15 text-red-300 border-theater-red/20"
            />
            <InfoStep
              delay={300}
              emoji="🥊"
              title="Knockout battles!"
              desc="Movies face off head-to-head. Majority advances — you can't vote your own pick!"
              accent="bg-purple-500/15 text-purple-300 border-purple-500/20"
            />
            <InfoStep
              delay={375}
              emoji="🏆"
              title="Confetti time!"
              desc="Last movie standing wins. Poster + Jellyfin link."
              accent="bg-theater-gold/15 text-yellow-300 border-theater-gold/20"
              last
            />
          </div>

          {/* Quick tips */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              <TipChip>🔒 PINs optional</TipChip>
              <TipChip>🎯 Age-filtered</TipChip>
              <TipChip>📱 Install as app</TipChip>
              <TipChip>♾️ Unlimited reshuffles</TipChip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoStep({
  delay,
  emoji,
  emoji2,
  emoji3,
  title,
  desc,
  accent,
  last,
}: {
  delay: number;
  emoji: string;
  emoji2?: string;
  emoji3?: string;
  title: string;
  desc: string;
  accent: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl border ${accent} transition-all animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex-shrink-0 text-3xl relative">
        {emoji}
        {emoji2 && (
          <span className="absolute -right-1 -top-1 text-lg">{emoji2}</span>
        )}
        {emoji3 && (
          <span className="absolute -right-3 top-2 text-sm">{emoji3}</span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-white text-sm leading-tight">{title}</h3>
        <p className="text-white/50 text-xs leading-snug mt-0.5">{desc}</p>
      </div>
      {!last && (
        <div className="ml-auto flex-shrink-0 text-white/10 text-lg">→</div>
      )}
    </div>
  );
}

function TipChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] font-medium">
      {children}
    </span>
  );
}
