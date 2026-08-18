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
}: {
  night: NightRecord;
  onDelete: (id: string) => void;
  onFix: (night: NightRecord) => void;
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
    <div className="glass-panel p-4 flex items-center gap-3">
      {displayPoster ? (
        <img
          src={displayPoster}
          alt={displayTitle}
          className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-black/30"
        />
      ) : (
        <div className="w-12 h-16 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
          🎬
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm truncate">
          {displayTitle}
        </h3>
        <p className="text-white/40 text-xs">
          {night.genre} &middot; {night.maxRating || "All ratings"}
        </p>
      </div>

      <time className="text-white/30 text-xs whitespace-nowrap">
        {new Date(night.date).toLocaleDateString()}
      </time>

      {!night.winnerTitle && night.nominations?.length > 0 && (
        <button
          onClick={() => onFix(night)}
          className="flex-shrink-0 p-2 rounded-lg text-white/20 hover:text-theater-gold hover:bg-theater-gold/10 transition-all"
          title="Mark first pick as winner"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      )}

      <button
        onClick={handleDelete}
        className={`flex-shrink-0 p-2 rounded-lg transition-all ${
          confirming
            ? "bg-red-500 text-white"
            : "text-white/20 hover:text-red-400 hover:bg-red-500/10"
        }`}
      >
        {confirming ? (
          <span className="text-xs font-bold">Sure?</span>
        ) : (
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
      </button>
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
              <NightRow
                key={night.id}
                night={night}
                onDelete={deleteNight}
                onFix={fixNight}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
