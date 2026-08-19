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
      <div className="flex items-center gap-3 mb-4">
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
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="film-spinner" />
          <p className="text-white/30 text-sm">Finding the perfect picks...</p>
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

      {/* Empty state — show button to trigger */}
      {!hasLoaded && !loading && !error && (
        <div className="text-center py-6">
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

      {/* Picks grid */}
      {picks.length > 0 && !loading && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {picks.map((pick, i) => (
            <button
              key={pick.id}
              onClick={() => onSelect?.(pick.id, pick.name)}
              className="group flex-shrink-0 w-[140px] sm:w-[160px]"
              style={{ animation: `ticketIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s both` }}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/[0.06] group-hover:border-theater-gold/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(245,197,24,0.1)]">
                <img
                  src={pick.poster}
                  alt={pick.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Rating badge */}
                {pick.communityRating && (
                  <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-theater-gold/90 border border-theater-gold/20">
                    ★ {pick.communityRating.toFixed(1)}
                  </span>
                )}

                {/* Title overlay */}
                <span className="absolute bottom-0 left-0 right-0 px-2 py-2 text-[11px] font-semibold text-white/80 leading-tight line-clamp-2">
                  {pick.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
