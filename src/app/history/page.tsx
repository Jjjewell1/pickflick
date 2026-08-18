"use client";

import { useState, useEffect, useRef } from "react";
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

const DELETE_WIDTH = 88;

function SwipeableRow({
  night,
  onDelete,
}: {
  night: NightRecord;
  onDelete: (id: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const dragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    startX.current = e.touches[0].clientX;
    startOffset.current = offset;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    setOffset(Math.max(-DELETE_WIDTH - 40, Math.min(0, startOffset.current + dx)));
  };

  const onTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (offset < -DELETE_WIDTH / 2) {
      setOffset(-DELETE_WIDTH);
    } else {
      setOffset(0);
      setConfirming(false);
    }
  };

  const handleDelete = () => {
    if (confirming) {
      onDelete(night.id);
    } else {
      setConfirming(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete action behind the row */}
      <div className="absolute inset-y-0 right-0 w-[88px] bg-red-600 flex items-center justify-center">
        <button
          onClick={handleDelete}
          className="w-full h-full text-white text-sm font-bold flex flex-col items-center justify-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {confirming ? "Sure?" : "Delete"}
        </button>
      </div>

      {/* Row content */}
      <div
        className="glass-panel p-4 flex items-center gap-4 relative"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? "none" : "transform 0.2s ease-out",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {night.winnerPoster ? (
          <img
            src={night.winnerPoster}
            alt={night.winnerTitle || "Winner"}
            className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-black/30"
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

        <span className="text-white/15 text-xs">‹</span>
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
            <p className="text-white/30 text-xs text-center mb-2">
              Swipe left to delete
            </p>
            {nights.map((night) => (
              <SwipeableRow key={night.id} night={night} onDelete={deleteNight} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
