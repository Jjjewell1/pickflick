"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PopcornBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
}

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative">
      <PopcornBackground />
      <Header />

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pb-20 pt-12">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🎬</span>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight">
              <span className="text-white">Pick</span>
              <span className="text-theater-red">Flick</span>
            </h1>
          </div>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            Pick a flick, together
          </p>
        </div>

        <Link
          href="/night"
          className="btn-primary text-xl px-12 py-5 mb-16 animate-pulse-glow rounded-3xl"
        >
          🍿 Start Movie Night
        </Link>

        <div className="w-full max-w-2xl">
          <h2 className="text-center text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
            Household
          </h2>
          {profiles.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <p className="text-white/40 mb-4">
                No household members set up yet
              </p>
              <Link
                href="/settings"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <span>+</span> Add Members
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="glass-panel px-5 py-3 flex items-center gap-3"
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <p className="font-semibold text-white text-sm">{p.name}</p>
                    <p className="text-white/40 text-xs capitalize">
                      {p.ageTier}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
