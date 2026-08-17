"use client";

import { useState, useEffect } from "react";

interface NominatorTransitionProps {
  profile: { name: string; emoji: string };
  isLast: boolean;
  onReady: () => void;
}

export default function NominatorTransition({
  profile,
  isLast,
  onReady,
}: NominatorTransitionProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    return () => clearTimeout(t1);
  }, []);

  const handleTap = () => {
    setPhase("exit");
    setTimeout(onReady, 400);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center"
      onClick={handleTap}
    >
      {/* Backdrop fade */}
      <div
        className={`absolute inset-0 bg-[#0D0508] transition-opacity duration-400 ${
          phase === "exit" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Radial burst rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-theater-gold/10"
          style={{
            width: `${200 + i * 120}px`,
            height: `${200 + i * 120}px`,
            animation: `pingRing 1.5s ease-out ${i * 0.2}s both`,
          }}
        />
      ))}

      {/* Emoji — scales in, bounces, then exits */}
      <div
        className={`relative z-10 transition-all duration-500 ${
          phase === "enter"
            ? "scale-0 opacity-0 rotate-[-20deg]"
            : phase === "hold"
              ? "scale-100 opacity-100 rotate-0"
              : "scale-[2.5] opacity-0 rotate-10"
        }`}
      >
        <div className="text-[100px] sm:text-[120px] leading-none select-none drop-shadow-2xl">
          {profile.emoji}
        </div>
        {/* Glow behind emoji */}
        <div className="absolute inset-0 -m-8 blur-3xl bg-theater-gold/20 rounded-full -z-10" />
      </div>

      {/* Name + instruction */}
      <div
        className={`relative z-10 text-center mt-6 transition-all duration-500 delay-200 ${
          phase === "enter"
            ? "opacity-0 translate-y-4"
            : phase === "hold"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8"
        }`}
      >
        <p className="text-white/40 text-sm uppercase tracking-widest mb-2">
          {isLast ? "Last picker" : "Pass it to"}
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
          {profile.name}
        </h2>
        <p className="text-theater-gold/60 text-sm animate-pulse mt-6">
          Tap anywhere to start
        </p>
      </div>

      {/* Floating particles */}
      {phase === "hold" &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
          <div
            key={j}
            className="absolute w-1 h-1 bg-theater-gold/40 rounded-full"
            style={{
              left: `${50 + Math.cos(j * 0.8) * 25}%`,
              top: `${50 + Math.sin(j * 0.8) * 25}%`,
              animation: `fadeInUp 0.8s ease-out ${j * 0.1}s both`,
              opacity: 0,
            }}
          />
        ))}
    </div>
  );
}
