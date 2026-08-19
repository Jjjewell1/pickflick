"use client";

import { useState } from "react";

interface AiSuggestion {
  id: string;
  name: string;
  poster: string;
  rating?: string;
  genres?: string[];
  overview?: string;
  communityRating?: number;
}

interface AiPicksProps {
  profiles: { name: string; ageTier: string; emoji: string }[];
  onSelect?: (movieId: string, title: string) => void;
}

function cleanTitle(name: string): string {
  return name
    .replace(/\s*\(\d{4}\)\s*/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\.\w{2,4}$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function AiPicks({ profiles, onSelect }: AiPicksProps) {
  const [picks, setPicks] = useState<AiSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchPicks = async () => {
    if (profiles.length === 0 || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profiles }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get suggestions");
      }

      const data = await res.json();
      setPicks(data.suggestions || []);
      setHasLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI suggestions unavailable");
    } finally {
      setLoading(false);
    }
  };

  if (profiles.length === 0) return null;

  return (
    <div
      className="w-full max-w-4xl"
      style={{ animation: "heroRise 0.7s ease-out 0.15s both" }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/8" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-theater-gold/60">
            ✦ AI Picks ✦
          </span>
        </div>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/8" />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px]">
              <div className="aspect-[2/3] rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse" />
              <div className="mt-2 h-3 bg-white/[0.04] rounded-full w-3/4 animate-pulse" />
              <div className="mt-1.5 h-2.5 bg-white/[0.03] rounded-full w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-6">
          <p className="text-white/25 text-xs mb-3">{error}</p>
          <button
            onClick={fetchPicks}
            className="text-theater-gold/50 text-xs hover:text-theater-gold transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Trigger button */}
      {!hasLoaded && !loading && !error && (
        <div className="text-center py-4">
          <button
            onClick={fetchPicks}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-theater-gold/40 hover:bg-theater-gold/[0.06] transition-all duration-300"
          >
            <span className="text-sm">✨</span>
            <span className="text-white/40 group-hover:text-theater-gold/80 text-sm font-medium transition-colors">
              Get AI movie suggestions
            </span>
          </button>
          <p className="text-white/15 text-[10px] mt-2">
            Powered by Ollama — based on your family profiles
          </p>
        </div>
      )}

      {/* Picks — poster cards with glass info strip below */}
      {picks.length > 0 && !loading && (
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
          {picks.map((pick, i) => (
            <button
              key={pick.id}
              onClick={() => onSelect?.(pick.id, pick.name)}
              className="group flex-shrink-0 w-[140px] sm:w-[160px] text-left"
              style={{ animation: `ticketIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s both` }}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-t-xl overflow-hidden bg-white/[0.03]">
                <img
                  src={pick.poster}
                  alt={pick.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Subtle bottom fade only — no heavy overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {/* Rating pill — top right */}
                {pick.communityRating && (
                  <span className="absolute top-2 right-2 flex items-center gap-0.5 text-[10px] font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-theater-gold border border-theater-gold/30 shadow-lg">
                    ★ {pick.communityRating.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Info strip */}
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] border-t-0 rounded-b-xl px-2.5 py-2">
                <p className="font-display text-[13px] font-bold text-white/90 leading-tight line-clamp-1 group-hover:text-theater-gold transition-colors">
                  {cleanTitle(pick.name)}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {pick.rating && (
                    <span className="text-[9px] font-bold text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded">
                      {pick.rating}
                    </span>
                  )}
                  {pick.genres && pick.genres[0] && (
                    <span className="text-[9px] text-white/25 truncate">
                      {pick.genres[0]}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
