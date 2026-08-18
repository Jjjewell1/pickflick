"use client";

import { useState, useEffect } from "react";
import PopcornBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";

interface NominationRecord {
  movieId: string;
  title: string;
  poster: string | null;
  profileId: string;
}

interface NightRecord {
  id: string;
  date: string;
  genre: string;
  winnerTitle: string | null;
  winnerPoster: string | null;
  maxRating: string;
  nominations: NominationRecord[];
}

function NightRow({
  night,
  onDelete,
  onFix,
  index,
}: {
  night: NightRecord;
  onDelete: (id: string) => void;
  onFix: (night: NightRecord) => void;
  index: number;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (confirming) {
      onDelete(night.id);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  const displayTitle =
    night.winnerTitle || night.nominations?.[0]?.title || "No winner";
  const displayPoster =
    night.winnerPoster ||
    (night.nominations?.[0]?.poster
      ? `/api/jellyfin/image?movieId=${night.nominations[0].poster}`
      : null);

  return (
    <div
      className="glass-panel flex items-center gap-0 overflow-hidden"
      style={{
        animation: `staggerFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.06 * index}s both`,
      }}
    >
      {/* Poster thumbnail */}
      {displayPoster ? (
        <img
          src={displayPoster}
          alt={displayTitle}
          className="w-16 h-24 object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-24 bg-white/5 flex items-center justify-center flex-shrink-0 text-2xl">
          🎬
        </div>
      )}

      <div className="flex-1 min-w-0 px-4 py-3">
        <h3 className="font-display text-lg tracking-wide text-white truncate">
          {displayTitle}
        </h3>
        <p className="text-white/40 text-xs mt-0.5">
          {night.genre} &middot; {night.maxRating || "All ratings"}
        </p>
        <time className="text-white/25 text-[10px] block mt-1">
          {new Date(night.date).toLocaleDateString()}
        </time>
      </div>

      <div className="flex items-center gap-1 pr-3 flex-shrink-0">
        {!night.winnerTitle && night.nominations?.length > 0 && (
          <button
            onClick={() => onFix(night)}
            className="p-2 rounded-lg text-white/20 hover:text-theater-gold hover:bg-theater-gold/10 transition-all"
            title="Mark first pick as winner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        )}

        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-all ${
            confirming
              ? "bg-red-500 text-white"
              : "text-white/20 hover:text-red-400 hover:bg-red-500/10"
          }`}
        >
          {confirming ? (
            <span className="text-xs font-bold px-1">Sure?</span>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [nights, setNights] = useState<NightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNights = () => {
    fetch("/api/night")
      .then((r) => r.json())
      .then((data) => {
        setNights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNights();
  }, []);

  const deleteNight = async (id: string) => {
    setNights((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/night?id=${id}`, { method: "DELETE" });
    } catch {
      fetchNights();
    }
  };

  const fixNight = async (night: NightRecord) => {
    const firstNom = night.nominations?.[0];
    if (!firstNom) return;

    try {
      await fetch("/api/night", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: night.id,
          winnerId: firstNom.movieId,
          winnerTitle: firstNom.title,
          winnerPoster: `/api/jellyfin/image?movieId=${firstNom.movieId}`,
        }),
      });
      fetchNights();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen relative">
      <PopcornBackground />
      <Header />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-4xl sm:text-5xl tracking-wide text-white mb-8 text-center bg-gradient-to-r from-theater-gold via-yellow-100 to-theater-gold bg-clip-text text-transparent">
          MOVIE NIGHT HISTORY
        </h1>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="film-spinner" />
            <p className="text-white/40 text-sm">Loading history...</p>
          </div>
        ) : nights.length === 0 ? (
          <div className="glass-panel p-10 text-center">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-white/40 text-sm">
              No movie nights yet. Start one from the home page!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {nights.map((night, i) => (
              <NightRow
                key={night.id}
                night={night}
                onDelete={deleteNight}
                onFix={fixNight}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
