"use client";

import { useEffect, useState, useMemo } from "react";

interface WinnerRevealProps {
  title: string;
  poster: string | null;
  overview: string | null;
  jellyfinUrl: string;
  jellyfinItemId: string;
}

function Confetti() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.8,
      duration: 2 + Math.random() * 2.5,
      color:
        ["#C03078", "#F5C518", "#E03060", "#F06048", "#FFD700", "#483078"][
          Math.floor(Math.random() * 6)
        ],
      size: 5 + Math.random() * 10,
      rotation: Math.random() * 360,
      shape: i % 4, // 0=circle, 1=square, 2=triangle, 3=strip
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: p.shape === 3 ? `${p.size * 0.4}px` : `${p.size}px`,
            height: p.shape === 3 ? `${p.size * 1.5}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 0 ? "50%" : p.shape === 2 ? "2px 2px 0 0" : "2px",
            clipPath: p.shape === 2 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
            animation: `confettiFall ${p.duration}s ease-out ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function SparkleParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const dist = 80 + Math.random() * 120;
      return {
        id: i,
        sx: `${Math.cos(angle) * dist}px`,
        sy: `${Math.sin(angle) * dist}px`,
        delay: 0.6 + Math.random() * 0.4,
        size: 3 + Math.random() * 4,
        color: i % 3 === 0 ? "#F5C518" : i % 3 === 1 ? "#C03078" : "#fff",
      };
    }), []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: "35%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            ["--sx" as string]: p.sx,
            ["--sy" as string]: p.sy,
            animation: `sparkleBurst 0.9s cubic-bezier(0.22,1,0.36,1) ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}

function BurstRings() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border-theater-gold/40"
          style={{
            width: "120px",
            height: "120px",
            top: "calc(35% - 60px)",
            left: "calc(50% - 60px)",
            borderWidth: "3px",
            borderStyle: "solid",
            animation: `burstRing 1.2s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.15}s both`,
          }}
        />
      ))}
    </div>
  );
}

export default function WinnerReveal({
  title,
  poster,
  overview,
  jellyfinUrl,
  jellyfinItemId,
}: WinnerRevealProps) {
  const [phase, setPhase] = useState<"flash" | "poster" | "title" | "done">("flash");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("poster"), 350),
      setTimeout(() => setPhase("title"), 900),
      setTimeout(() => setPhase("done"), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
      {/* Spotlight backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 35%, rgba(245,197,24,0.12) 0%, rgba(192,48,120,0.05) 40%, transparent 70%)",
          animation: "spotlightFlash 1.5s ease-out both",
        }}
      />

      <Confetti />
      <BurstRings />
      <SparkleParticles />

      <div className="relative z-10 flex flex-col items-center">
        {/* "The winner is..." */}
        <p
          className="text-white/50 text-lg mb-6"
          style={{
            animation: phase !== "flash" ? "titleReveal 0.6s ease-out both" : "none",
            opacity: phase === "flash" ? 0 : undefined,
          }}
        >
          The winner is...
        </p>

        {/* Poster — the hero */}
        {poster && (
          <div
            className="relative mx-auto mb-8 w-52 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden"
            style={{
              animation: phase === "flash" ? "none" : "posterZoom 0.9s cubic-bezier(0.22,1,0.36,1) both",
              boxShadow: "0 0 40px rgba(245,197,24,0.3), 0 0 80px rgba(245,197,24,0.15), 0 20px 60px rgba(0,0,0,0.6)",
              border: "2px solid rgba(245,197,24,0.4)",
            }}
          >
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Gold vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-theater-gold/10 pointer-events-none" />
          </div>
        )}

        {/* Crown */}
        <div
          className="text-5xl mb-4"
          style={{
            animation: phase === "flash" ? "none" : "crownDrop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
          }}
        >
          👑
        </div>

        {/* Title */}
        <h1
          className="font-display text-5xl sm:text-7xl tracking-wider text-center leading-none mb-4 max-w-lg"
          style={{
            animation: phase === "flash" ? "none" : "titleReveal 0.7s ease-out 0.5s both",
            background: "linear-gradient(135deg, #F5C518 0%, #fff7d6 45%, #F5C518 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 20px rgba(245,197,24,0.4))",
          }}
        >
          {title}
        </h1>

        {/* Overview */}
        {overview && (
          <p
            className="max-w-md mx-auto text-white/50 text-sm leading-relaxed mb-8 text-center px-4"
            style={{
              animation: phase === "done" ? "titleReveal 0.6s ease-out both" : "none",
              opacity: phase === "done" ? undefined : 0,
            }}
          >
            {overview}
          </p>
        )}

        {/* Jellyfin link */}
        {jellyfinItemId && jellyfinUrl !== "#" && (
          <a
            href={`${jellyfinUrl}/web/index.html#!/details?id=${jellyfinItemId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
            style={{
              animation: phase === "done" ? "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" : "none",
              opacity: phase === "done" ? undefined : 0,
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Open in Jellyfin
          </a>
        )}
      </div>
    </div>
  );
}
