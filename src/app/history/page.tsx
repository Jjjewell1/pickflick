"use client";

import { useState, useEffect } from "react";
import PopcornBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";

interface NightRecord {
  id: string;
  date: string;
  genre: string;
  winnerTitle: string | null;
  winnerPoster: string | null;
  maxRating: string;
}

export default function HistoryPage() {
  const [nights, setNights] = useState<NightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/night")
      .then((r) => r.json())
      .then((data) => {
        setNights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative">
      <PopcornBackground />
      <Header />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-white mb-8 text-center">
          Movie Night History
        </h1>

        {loading ? (
          <div className="text-center py-12 text-white/40">
            Loading history...
          </div>
        ) : nights.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-white/40">
              No movie nights yet. Start one from the home page!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {nights.map((night) => (
              <div key={night.id} className="glass-panel p-4 flex items-center gap-4">
                {night.winnerPoster ? (
                  <img
                    src={night.winnerPoster}
                    alt={night.winnerTitle || "Winner"}
                    className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                    🎬
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {night.winnerTitle || "No winner"}
                  </h3>
                  <p className="text-white/40 text-xs">
                    {night.genre} &middot; {night.maxRating || "All ratings"}
                  </p>
                </div>

                <time className="text-white/30 text-xs whitespace-nowrap">
                  {new Date(night.date).toLocaleDateString()}
                </time>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
