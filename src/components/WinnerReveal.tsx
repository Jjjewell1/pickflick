"use client";

import { useEffect, useState } from "react";

interface WinnerRevealProps {
  title: string;
  poster: string | null;
  overview: string | null;
  jellyfinUrl: string;
  jellyfinItemId: string;
}

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      color:
        ["#C41E3A", "#F5C518", "#FF6B35", "#E82548", "#FFD700"][
          Math.floor(Math.random() * 5)
        ],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-out ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      <Confetti />

      <div
        className={`text-center transition-all duration-700 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <p className="text-white/50 text-lg mb-4">The winner is...</p>

        {poster && (
          <div className="mx-auto mb-6 w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-theater-gold/20 ring-2 ring-theater-gold/50">
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-theater-gold text-glow-gold mb-4 animate-scale-in">
          {title}
        </h1>

        {overview && (
          <p className="max-w-md mx-auto text-white/60 text-sm leading-relaxed mb-6 animate-fade-in-up">
            {overview}
          </p>
        )}

        {jellyfinItemId && jellyfinUrl !== "#" && (
          <a
            href={`${jellyfinUrl}/web/index.html#!/details?id=${jellyfinItemId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 animate-fade-in-up"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Open in Jellyfin
          </a>
        )}
      </div>
    </div>
  );
}
