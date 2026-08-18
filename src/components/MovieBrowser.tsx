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
}

function MovieCard({ movie, posterUrl, nominated, onNominate }: MovieCardProps) {
  return (
    <div
      className={`glass-panel overflow-hidden transition-all duration-200 ${
        nominated
          ? "ring-2 ring-theater-gold bg-theater-gold/10"
          : "hover:bg-white/5"
      }`}
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
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎬
          </div>
        )}
        {movie.OfficialRating && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {movie.OfficialRating}
          </span>
        )}
        {nominated && (
          <span className="absolute top-2 left-2 bg-theater-gold text-black text-xs px-1.5 py-0.5 rounded font-bold">
            Nominated ✓
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm leading-tight truncate">
          {movie.Name}
        </h3>
        {movie.CommunityRating && (
          <p className="text-theater-gold text-xs mt-1">
            ⭐ {movie.CommunityRating.toFixed(1)}
          </p>
        )}
        <button
          onClick={() => onNominate(movie)}
          className={`mt-2 w-full text-xs py-1.5 rounded-xl font-medium transition-all ${
            nominated
              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 active:scale-95"
              : "bg-theater-red/20 text-theater-red hover:bg-theater-red/30 active:scale-95"
          }`}
        >
          {nominated ? "✕ Remove" : "+ Nominate"}
        </button>
      </div>
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
  const [order, setOrder] = useState<Movie[]>(movies);
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
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-theater-red/50 focus:border-transparent"
        />
        <button
          onClick={shuffle}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-theater-gold/15 border border-theater-gold/30 text-theater-gold text-sm font-semibold hover:bg-theater-gold/25 active:scale-95 transition-all whitespace-nowrap"
        >
          <span className={`inline-block ${shuffling ? "animate-card-shuffle" : ""}`}>🔀</span>
          Shuffle
        </button>
        <span className="text-white/40 text-sm whitespace-nowrap">
          {currentNominations}/{maxNominations}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((movie) => (
          <MovieCard
            key={movie.Id}
            movie={movie}
            posterUrl={
              movie.Id
                ? `/api/jellyfin/image?movieId=${movie.Id}`
                : ""
            }
            nominated={nominations.has(movie.Id)}
            onNominate={onNominate}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <p className="text-4xl mb-3">🍿</p>
          <p>No movies found{search ? " matching your search" : ""}</p>
        </div>
      )}
    </div>
  );
}
