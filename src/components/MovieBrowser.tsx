"use client";

import { useState, useEffect } from "react";

interface Movie {
  Id: string;
  Name: string;
  OfficialRating?: string;
  Overview?: string;
  CommunityRating?: number;
  UserData?: {
    Played?: boolean;
  };
}

interface MovieCardProps {
  movie: Movie;
  posterUrl: string;
  nominated: boolean;
  onNominate: (movie: Movie) => void;
  index: number;
}

function MovieCard({ movie, posterUrl, nominated, onNominate, index }: MovieCardProps) {
  return (
    <div
      className={`poster-card ${nominated ? "poster-card-nominated" : ""}`}
      style={{
        animation: `staggerFadeIn 0.55s cubic-bezier(0.22,1,0.36,1) ${0.06 * index}s both`,
      }}
    >
      <div className="relative aspect-[2/3] bg-black/30">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.Name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-white/20">
            ◈
          </div>
        )}

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Rating badge */}
        {movie.OfficialRating && (
          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md font-semibold border border-white/10">
            {movie.OfficialRating}
          </span>
        )}

        {/* Nominated badge */}
        {nominated && (
          <span className="absolute top-2 left-2 bg-cyan text-black text-[10px] px-2 py-0.5 rounded-md font-bold shadow-lg">
            Nominated ✓
          </span>
        )}

        {/* Poster shine on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          <h3 className="font-display font-bold text-white text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-lg">
            {movie.Name}
          </h3>
          {movie.CommunityRating && (
            <p className="text-cyan text-xs mt-1 drop-shadow-md">
              ⭐ {movie.CommunityRating.toFixed(1)}
            </p>
          )}
        </div>
      </div>

      {/* Nominate/remove button */}
      <button
        onClick={() => onNominate(movie)}
        className={`w-full text-xs py-2.5 font-semibold transition-all ${
          nominated
            ? "bg-red-500/15 text-red-300 hover:bg-red-500/25 active:scale-[0.97]"
            : "bg-white/5 text-white/70 hover:bg-cyan/15 hover:text-cyan active:scale-[0.97]"
        }`}
      >
        {nominated ? "✕ Remove" : "+ Nominate"}
      </button>
    </div>
  );
}

interface MovieBrowserProps {
  movies: Movie[];
  nominations: Map<string, { movieId: string; title: string; poster: string | null }>;
  onNominate: (movie: Movie) => void;
  maxNominations: number;
  currentNominations: number;
}

export default function MovieBrowser({
  movies,
  nominations,
  onNominate,
  maxNominations,
  currentNominations,
}: MovieBrowserProps) {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(movies);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    setOrder(movies);
  }, [movies]);

  const shuffle = () => {
    setShuffling(true);
    setOrder([...order].sort(() => Math.random() - 0.5));
    setTimeout(() => setShuffling(false), 400);
  };

  const filtered = order.filter((m) =>
    m.Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="w-full bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/30 transition-all"
          />
        </div>
        <button
          onClick={shuffle}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan/10 border border-cyan/25 text-cyan text-sm font-semibold hover:bg-cyan/20 hover:border-cyan/40 active:scale-95 transition-all whitespace-nowrap"
        >
          <span className={`inline-block ${shuffling ? "animate-spin" : ""}`}>↻</span>
          Shuffle
        </button>
        <span className="text-white/30 text-sm whitespace-nowrap font-mono">
          {currentNominations}/{maxNominations}
        </span>
      </div>

      {/* Movie grid — poster-forward */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((movie, i) => (
          <MovieCard
            key={movie.Id}
            movie={movie}
            posterUrl={
              movie.Id ? `/api/jellyfin/image?movieId=${movie.Id}` : ""
            }
            nominated={nominations.has(movie.Id)}
            onNominate={onNominate}
            index={i}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/40">
          <p className="text-5xl mb-4 opacity-30">◈</p>
          <p className="text-sm">
            No movies found{search ? " matching your search" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
