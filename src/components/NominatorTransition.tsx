"use client";

import { useState, useEffect } from "react";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
}

interface NominatorTransitionProps {
  currentProfile: Profile;
  previousProfile: Profile | null;
  remainingProfiles: Profile[];
  isLast: boolean;
  onReady: () => void;
}

function PopcornPiece({ delay, startX, startY }: { delay: number; startX: number; startY: number }) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 80 + Math.random() * 160;
  const endX = startX + Math.cos(angle) * dist;
  const endY = startY + Math.sin(angle) * dist - 60;
  const rotation = Math.random() * 720 - 360;
  const size = 12 + Math.random() * 10;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animation: `popcornBurst 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s both`,
        ["--endX" as string]: `${endX}%`,
        ["--endY" as string]: `${endY}%`,
        ["--rot" as string]: `${rotation}deg`,
      }}
    >
      <span style={{ fontSize: `${size}px` }}>
        {Math.random() > 0.4 ? "🍿" : Math.random() > 0.5 ? "✨" : "⭐"}
      </span>
    </div>
  );
}

export default function NominatorTransition({
  currentProfile,
  previousProfile,
  remainingProfiles,
  isLast,
  onReady,
}: NominatorTransitionProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const t = setTimeout(() => setPhase("hold"), 500);
    return () => clearTimeout(t);
  }, []);

  const handleTap = () => {
    setPhase("exit");
    setTimeout(onReady, 450);
  };

  const popcorns = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.3,
    startX: 45 + Math.random() * 10,
    startY: 35 + Math.random() * 10,
  }));

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      onClick={handleTap}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[#0B0D1E] transition-opacity duration-500 ${
          phase === "exit" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-theater-red/5 blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-theater-gold/5 blur-[120px]" />

      {/* Burst rings */}
      {phase !== "enter" && [0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-theater-gold/10"
          style={{
            width: `${180 + i * 100}px`,
            height: `${180 + i * 100}px`,
            top: "50%",
            left: "50%",
            marginTop: `-${90 + i * 50}px`,
            marginLeft: `-${90 + i * 50}px`,
            animation: `pingRing 1.2s ease-out ${i * 0.15}s both`,
          }}
        />
      ))}

      {/* Popcorn explosion */}
      {phase === "hold" && popcorns.map((p) => (
        <PopcornPiece key={p.id} delay={p.delay} startX={p.startX} startY={p.startY} />
      ))}

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-500 ${
          phase === "exit" ? "scale-110 opacity-0" : phase === "enter" ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Previous picker — done! */}
        {previousProfile && (
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="relative">
                <span className="text-4xl">{previousProfile.emoji}</span>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Just picked</p>
                <p className="text-white font-semibold text-sm">{previousProfile.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Arrow down */}
        <div className="mb-4 text-theater-gold/30 text-2xl animate-bounce">▼</div>

        {/* Current picker — big emoji */}
        <div className="relative mb-4">
          <div
            className="text-[90px] sm:text-[110px] leading-none select-none drop-shadow-2xl transition-all duration-600"
            style={{
              animation: "bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both",
            }}
          >
            {currentProfile.emoji}
          </div>
          <div className="absolute inset-0 -m-10 blur-3xl bg-theater-gold/15 rounded-full -z-10" />
        </div>

        {/* Current picker name */}
        <div className="text-center mb-2">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
            {isLast ? "Last picker" : "Up next"}
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-bold text-white"
            style={{ animation: "fadeInUp 0.5s ease-out 0.4s both" }}
          >
            {currentProfile.name}
          </h2>
        </div>

        {/* Remaining crew cards */}
        {remainingProfiles.length > 0 && (
          <div className="flex items-center gap-2 mt-6">
            {remainingProfiles.map((p, i) => (
              <div
                key={p.id}
                className="flex flex-col items-center gap-1 transition-all"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${0.5 + i * 0.1}s both`,
                }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all ${
                  p.id === currentProfile.id
                    ? "border-theater-gold bg-theater-gold/10 shadow-lg shadow-theater-gold/20 scale-110"
                    : "border-white/10 bg-white/5"
                }`}>
                  {p.emoji}
                </div>
                <span className={`text-[10px] font-medium ${
                  p.id === currentProfile.id ? "text-theater-gold" : "text-white/30"
                }`}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tap prompt */}
        <p
          className="text-theater-gold/50 text-sm mt-8 animate-pulse"
          style={{ animation: "fadeInUp 0.5s ease-out 0.8s both" }}
        >
          Tap anywhere to start
        </p>
      </div>
    </div>
  );
}

