"use client";

import { useState, useCallback } from "react";

interface GenreDeckProps {
  genres: string[];
  onGenreSelected: (genre: string) => void;
  canReroll: boolean;
  onReroll: () => void;
}

const EMOJI_MAP: Record<string, string> = {
  Action: "💥",
  Adventure: "🗺️",
  Animation: "✨",
  Comedy: "😂",
  Crime: "🔪",
  Documentary: "📹",
  Drama: "🎭",
  Family: "👨‍👩‍👧‍👦",
  Fantasy: "🧙",
  History: "📜",
  Horror: "👻",
  Music: "🎵",
  Mystery: "🔍",
  Romance: "❤️",
  "Science Fiction": "🚀",
  "TV Movie": "📺",
  Thriller: "😱",
  War: "⚔️",
  Western: "🤠",
};

export default function GenreDeck({
  genres,
  onGenreSelected,
  canReroll,
  onReroll,
}: GenreDeckProps) {
  const [shuffling, setShuffling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dealIndex, setDealIndex] = useState(-1);

  const shuffle = useCallback(() => {
    if (shuffling || genres.length === 0) return;
    setShuffling(true);
        setResult(null);

        const shuffled = [...genres].sort(() => Math.random() - 0.5);
    let i = 0;
    const interval = setInterval(() => {
      setDealIndex(i);
      i++;
      if (i >= Math.min(shuffled.length, 8)) {
        clearInterval(interval);
        const picked = shuffled[Math.floor(Math.random() * shuffled.length)];
        setDealIndex(-1);
        setResult(picked);
        setShuffling(false);
        onGenreSelected(picked);
      }
    }, 180);
  }, [shuffling, genres, onGenreSelected]);

  const visibleCount = Math.min(genres.length, 8);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-56 h-72 sm:w-64 sm:h-80" style={{ perspective: "800px" }}>
        {!result && genres.map((genre, i) => {
          if (i >= visibleCount) return null;
          const isActive = shuffling && dealIndex >= 0 && (i % visibleCount) === (dealIndex % visibleCount);
          const offset = isActive ? -12 : 0;
          const rotation = isActive ? -2 + Math.random() * 4 : -3 + (i * 0.5);

          return (
            <div
              key={genre}
              className="absolute inset-0 rounded-2xl transition-all duration-150"
              style={{
                transform: `translateY(${offset + i * 2}px) rotate(${rotation}deg)`,
                zIndex: isActive ? 20 : i,
                opacity: shuffling ? (isActive ? 1 : 0.6) : 1,
              }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-theater-gold/40 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #1a0a0a 0%, #2d1015 50%, #1a0a0a 100%)",
                }}
              >
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-5xl sm:text-6xl mb-4">{EMOJI_MAP[genre] || "🎬"}</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-white">{genre}</span>
                </div>
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-theater-red/30 flex items-center justify-center text-theater-gold font-bold text-xs">
                  {i + 1}
                </div>
              </div>
            </div>
          );
        })}

        {result && (
          <div className="absolute inset-0 animate-fade-in-up">
            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-theater-gold shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #1a0a0a 0%, #2d1015 50%, #1a0a0a 100%)",
              }}
            >
              <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <span className="text-6xl sm:text-7xl mb-4">{EMOJI_MAP[result] || "🎬"}</span>
                <span className="font-display text-2xl sm:text-3xl font-bold text-theater-gold text-glow-gold">{result}</span>
                <p className="text-white/40 text-sm mt-2">Tonight&apos;s Genre</p>
              </div>
            </div>
          </div>
        )}

        {!shuffling && !result && (
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
            <span className="text-white/20 text-sm">Shuffle to pick</span>
          </div>
        )}
      </div>

      {!result && (
        <button onClick={shuffle} disabled={shuffling || genres.length === 0} className="btn-primary">
          {shuffling ? "Shuffling..." : "🔀 Shuffle & Deal"}
        </button>
      )}

      {result && (
        <div className="flex flex-col items-center gap-3 animate-fade-in-up">
          {canReroll && (
            <button
              onClick={() => {
                setResult(null);
                onReroll();
              }}
              className="btn-secondary text-sm"
            >
              🎲 Reroll Genre
            </button>
          )}
        </div>
      )}
    </div>
  );
}
