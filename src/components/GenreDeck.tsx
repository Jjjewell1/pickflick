"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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

const CARD_COLORS = [
  "from-cyan-900/80 via-cyan-800/60 to-cyan-950/80",
  "from-teal-900/80 via-teal-800/60 to-teal-950/80",
  "from-sky-900/80 via-sky-800/60 to-sky-950/80",
  "from-blue-900/80 via-blue-800/60 to-blue-950/80",
  "from-cyan-950/80 via-cyan-900/60 to-cyan-800/80",
  "from-teal-950/80 via-teal-900/60 to-teal-800/80",
];

function CardBack() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl relative bg-gradient-to-br from-[#0f1219] via-[#0c0e15] to-[#0a0c12]">
      <div className="absolute inset-2 rounded-xl border border-cyan/[0.06]" />
      <div className="absolute inset-4 rounded-lg border border-cyan/[0.04]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <span className="text-4xl sm:text-5xl opacity-60">◈</span>
          <div className="absolute inset-0 blur-lg bg-cyan/10 rounded-full" />
        </div>
      </div>
      <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-cyan/[0.04] border border-cyan/[0.08]" />
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan/[0.04] border border-cyan/[0.08]" />
      <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full bg-cyan/[0.04] border border-cyan/[0.08]" />
      <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-cyan/[0.04] border border-cyan/[0.08]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
    </div>
  );
}

function CardFront({ genre, colorIndex }: { genre: string; colorIndex: number }) {
  const emoji = EMOJI_MAP[genre] || "🎬";
  const colorClass = CARD_COLORS[colorIndex % CARD_COLORS.length];

  return (
    <div className={`w-full h-full rounded-2xl overflow-hidden border border-cyan/20 shadow-2xl relative bg-gradient-to-br ${colorClass}`}>
      <div className="absolute inset-2 rounded-xl border border-white/10" />
      <div className="h-full flex flex-col items-center justify-center p-4 text-center relative z-10">
        <span className="text-5xl sm:text-6xl mb-3 drop-shadow-lg">{emoji}</span>
        <span className="font-display text-lg sm:text-xl font-bold text-white drop-shadow-md leading-tight">
          {genre}
        </span>
      </div>
      <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-cyan font-bold text-[10px] border border-cyan/20">
        {genre[0]}
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-cyan font-bold text-[10px] border border-cyan/20 rotate-180">
        {genre[0]}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
    </div>
  );
}

export default function GenreDeck({
  genres,
  onGenreSelected,
  canReroll,
  onReroll,
}: GenreDeckProps) {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "dealing" | "revealed">("idle");
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [dealtGenre, setDealtGenre] = useState<string | null>(null);
  const [dealtColorIndex, setDealtColorIndex] = useState(0);
  const [showFront, setShowFront] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const shuffle = useCallback(() => {
    if (phase === "shuffling" || phase === "dealing" || genres.length === 0) return;

    setPhase("shuffling");
    setShowFront(false);
    setDealtGenre(null);

    const shuffled = [...genres].sort(() => Math.random() - 0.5);
    let i = 0;
    const speed = 90;

    intervalRef.current = setInterval(() => {
      setShuffleIndex(i % shuffled.length);
      i++;

      if (i >= shuffled.length * 2 + 6) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const picked = shuffled[Math.floor(Math.random() * shuffled.length)];
        const colorIdx = Math.floor(Math.random() * CARD_COLORS.length);
        setDealtGenre(picked);
        setDealtColorIndex(colorIdx);
        setPhase("dealing");

        setTimeout(() => {
          setShowFront(true);
          setTimeout(() => {
            setPhase("revealed");
            onGenreSelected(picked);
          }, 500);
        }, 400);
      }
    }, speed);
  }, [phase, genres, onGenreSelected]);

  const handleReshuffle = useCallback(() => {
    shuffle();
  }, [shuffle]);

  const handleNewGenres = useCallback(() => {
    setPhase("idle");
    setShowFront(false);
    setDealtGenre(null);
    onReroll();
  }, [onReroll]);

  const displayGenre = phase === "shuffling" ? genres[shuffleIndex % genres.length] : null;
  const displayColor = phase === "shuffling" ? shuffleIndex % CARD_COLORS.length : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* The Deck */}
      <div className="relative w-52 h-72 sm:w-60 sm:h-80" style={{ perspective: "1000px" }}>
        {/* Stacked back cards (static fan) */}
        {phase === "idle" && genres.slice(0, Math.min(genres.length, 6)).map((_, i) => (
          <div
            key={`stack-${i}`}
            className="absolute inset-0 transition-all duration-300"
            style={{
              transform: `translateY(${i * 3}px) rotate(${-2 + i * 0.8}deg)`,
              zIndex: i,
              opacity: 1 - i * 0.08,
            }}
          >
            <CardBack />
          </div>
        ))}

        {/* Shuffling - rapid cycling card */}
        {phase === "shuffling" && (
          <>
            <div
              className="absolute inset-0 animate-card-shuffle"
              style={{ zIndex: 10 }}
            >
              {displayGenre && (
                <CardFront genre={displayGenre} colorIndex={displayColor} />
              )}
            </div>
            {/* Shaking deck behind */}
            <div
              className="absolute inset-0"
              style={{
                zIndex: 5,
                transform: `translateY(${Math.min(shuffleIndex % 3, 1) * 2}px) rotate(${shuffleIndex % 2 === 0 ? -1 : 1}deg)`,
              }}
            >
              <CardBack />
            </div>
            {/* Speed lines */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="w-8 h-0.5 bg-cyan/30 rounded-full mb-2"
                  style={{
                    opacity: (shuffleIndex + j) % 3 === 0 ? 0.6 : 0.1,
                    transform: `translateX(${-j * 4}px)`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Dealing - card flies up */}
        {phase === "dealing" && dealtGenre && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 20,
              animation: "dealSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            }}
          >
            <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  transition: "transform 0.5s ease-out",
                  transform: showFront ? "rotateY(0deg)" : "rotateY(180deg)",
                }}
              >
                <CardFront genre={dealtGenre} colorIndex={dealtColorIndex} />
              </div>
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  transition: "transform 0.5s ease-out",
                  transform: showFront ? "rotateY(-180deg)" : "rotateY(0deg)",
                }}
              >
                <CardBack />
              </div>
            </div>
          </div>
        )}

        {/* Revealed - final card with glow */}
        {phase === "revealed" && dealtGenre && (
          <div
            className="absolute inset-0 animate-card-flip-in"
            style={{ zIndex: 20 }}
          >
            <div className="relative w-full h-full">
              <CardFront genre={dealtGenre} colorIndex={dealtColorIndex} />
              {/* Glow ring */}
              <div className="absolute -inset-3 rounded-3xl border border-cyan/20 animate-pulse-glow pointer-events-none" />
              {/* Sparkle particles */}
              {[0, 1, 2, 3, 4, 5].map((j) => (
                <div
                  key={j}
                  className="absolute w-1.5 h-1.5 bg-cyan rounded-full"
                  style={{
                    top: `${20 + Math.sin(j * 1.2) * 30}%`,
                    left: `${20 + Math.cos(j * 1.2) * 30}%`,
                    animation: `fadeInUp 0.6s ease-out ${j * 0.1}s both`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dealt-away stack (back cards remain behind) */}
        {(phase === "dealing" || phase === "revealed") && (
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            <CardBack />
          </div>
        )}
      </div>

      {/* Status text */}
      <div className="h-8 flex items-center">
        {phase === "shuffling" && (
          <p className="text-cyan/60 text-sm font-medium animate-pulse">
            ✦ Picking your genre...
          </p>
        )}
        {phase === "dealing" && (
          <p className="text-white/50 text-sm animate-fade-in-up">
            Dealing...
          </p>
        )}
        {phase === "revealed" && dealtGenre && (
          <div className="text-center animate-fade-in-up">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Tonight&apos;s Genre</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {phase === "idle" && (
        <button
          onClick={shuffle}
          disabled={genres.length === 0}
          className="btn-primary relative overflow-hidden"
        >
          <span className="relative z-10">Shuffle & Deal</span>
        </button>
      )}

      {phase === "revealed" && (
        <div className="flex flex-col items-center gap-3 animate-fade-in-up">
          <button
            onClick={handleReshuffle}
            className="btn-primary text-sm px-6 py-3"
          >
            Reshuffle
          </button>
          {canReroll && (
            <button
              onClick={handleNewGenres}
              className="btn-secondary text-sm"
            >
              New Genres
            </button>
          )}
        </div>
      )}
    </div>
  );
}
