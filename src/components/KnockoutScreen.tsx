"use client";

import { useState, useEffect } from "react";

interface Nomination {
  movieId: string;
  title: string;
  poster: string | null;
  profileId: string;
  profileName: string;
  profileEmoji: string;
}

interface Participant {
  id: string;
  name: string;
  emoji: string;
}

interface KnockoutScreenProps {
  movieA: Nomination;
  movieB: Nomination | null;
  participants: Participant[];
  votes: Map<string, Set<string>>;
  onVote: (movieId: string, profileId: string) => void;
  onAdvance: (winnerId: string) => void;
  roundLabel: string;
  matchLabel: string;
  isFinal: boolean;
  remainingCount: number;
}

export default function KnockoutScreen({
  movieA,
  movieB,
  participants,
  votes,
  onVote,
  onAdvance,
  roundLabel,
  matchLabel,
  isFinal,
  remainingCount,
}: KnockoutScreenProps) {
  const [voterId, setVoterId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [currentMatchId, setCurrentMatchId] = useState(movieA.movieId);

  // New matchup — reset resolve state but keep the selected voter
  useEffect(() => {
    if (movieA.movieId !== currentMatchId) {
      setCurrentMatchId(movieA.movieId);
      setResolving(false);
      setWinnerId(null);
    }
  }, [movieA.movieId, currentMatchId]);

  const votesA = votes.get(movieA.movieId);
  const votesB = movieB ? votes.get(movieB.movieId) : undefined;
  const countA = votesA?.size || 0;
  const countB = votesB?.size || 0;
  const totalVotes = countA + countB;
  const everyoneVoted = movieB ? totalVotes >= participants.length : true;

  // A voter can't vote for their own nomination — unless BOTH movies are theirs
  const isLocked = (movie: Nomination, pid: string | null) => {
    if (!pid || !movieB) return false;
    const bothYours = movieA.profileId === pid && movieB.profileId === pid;
    if (bothYours) return false;
    return movie.profileId === pid;
  };

  const handleResolve = () => {
    if (resolving) return;
    let winner: string;
    if (!movieB) {
      winner = movieA.movieId;
    } else if (countA > countB) {
      winner = movieA.movieId;
    } else if (countB > countA) {
      winner = movieB.movieId;
    } else {
      winner = Math.random() > 0.5 ? movieA.movieId : movieB.movieId;
    }
    setWinnerId(winner);
    setResolving(true);
    setTimeout(() => onAdvance(winner), 1400);
  };

  return (
    <div className="space-y-5">
      {/* Round header */}
      <div className="text-center">
        <p className="text-theater-gold/80 text-xs uppercase tracking-[0.25em] font-bold mb-1">
          {roundLabel}
        </p>
        <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-theater-gold via-yellow-200 to-theater-gold bg-clip-text text-transparent">
          {isFinal ? "The Final Showdown" : "Head-to-Head"}
        </h2>
        <p className="text-white/40 text-xs mt-1">
          {matchLabel} · {remainingCount} {remainingCount === 1 ? "movie" : "movies"} left
        </p>
      </div>

      {/* Voter selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {participants.map((p) => {
          const voted = (movieA && votes.get(movieA.movieId)?.has(p.id)) ||
            (movieB && votes.get(movieB.movieId)?.has(p.id));
          return (
            <button
              key={p.id}
              onClick={() => setVoterId(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                voterId === p.id
                  ? "bg-theater-red text-white ring-2 ring-theater-red/50 scale-105 shadow-lg shadow-theater-red/30"
                  : voted
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              <span className="text-base">{p.emoji}</span>
              {p.name}
              {voted && voterId !== p.id && <span className="text-[10px]">✓</span>}
            </button>
          );
        })}
      </div>

      {/* The Arena */}
      <div className="relative grid grid-cols-2 gap-3 sm:gap-6 items-stretch">
        {/* VS badge */}
        {movieB && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-lg sm:text-xl italic
                bg-gradient-to-br from-theater-red via-red-500 to-theater-red-dark
                border-2 border-theater-gold/50 shadow-xl shadow-theater-red/40
                ${resolving ? "animate-pulse" : "animate-pulse-glow"}`}
            >
              <span className="text-white drop-shadow-md">VS</span>
            </div>
          </div>
        )}

        <FighterCard
          movie={movieA}
          votes={votesA}
          participants={participants}
          voterId={voterId}
          locked={isLocked(movieA, voterId)}
          dimmed={resolving && winnerId !== movieA.movieId}
          crowned={resolving && winnerId === movieA.movieId}
          onPick={() => voterId && !resolving && onVote(movieA.movieId, voterId)}
        />

        {movieB ? (
          <FighterCard
            movie={movieB}
            votes={votesB}
            participants={participants}
            voterId={voterId}
            locked={isLocked(movieB, voterId)}
            dimmed={resolving && winnerId !== movieB.movieId}
            crowned={resolving && winnerId === movieB.movieId}
            onPick={() => voterId && !resolving && onVote(movieB.movieId, voterId)}
          />
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-theater-gold/30 bg-theater-gold/5 flex flex-col items-center justify-center p-6 animate-fade-in-up">
            <span className="text-5xl mb-3">🎟️</span>
            <p className="text-theater-gold font-display font-bold text-lg">Bye</p>
            <p className="text-white/40 text-xs text-center mt-1">
              Odd number — this one advances automatically
            </p>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="text-center min-h-[64px] flex flex-col items-center justify-center gap-2">
        {!voterId && !resolving && (
          <p className="text-white/30 text-sm animate-pulse">
            ☝️ Pick your name, then tap a poster
          </p>
        )}
        {voterId && !everyoneVoted && !resolving && (
          <p className="text-white/40 text-sm">
            Waiting for everyone to vote...{" "}
            <span className="text-theater-gold font-bold">
              {totalVotes}/{participants.length}
            </span>
          </p>
        )}
        {everyoneVoted && !resolving && (
          <button onClick={handleResolve} className="btn-primary animate-scale-in">
            {isFinal ? "Crown the Winner 🏆" : "Advance Winner →"}
          </button>
        )}
        {resolving && (
          <p className="text-theater-gold text-sm font-bold animate-pulse">
            {countA === countB && movieB ? "🎲 Coin flip decides..." : "✨ Winner!"}
          </p>
        )}
      </div>
    </div>
  );
}

function FighterCard({
  movie,
  votes,
  participants,
  voterId,
  locked,
  dimmed,
  crowned,
  onPick,
}: {
  movie: Nomination;
  votes: Set<string> | undefined;
  participants: Participant[];
  voterId: string | null;
  locked: boolean;
  dimmed: boolean;
  crowned: boolean;
  onPick: () => void;
}) {
  const hasVoted = voterId ? votes?.has(voterId) : false;

  return (
    <button
      onClick={onPick}
      disabled={!voterId || locked || crowned}
      className={`relative rounded-3xl overflow-hidden text-left transition-all duration-500 group
        ${dimmed ? "opacity-25 scale-95 grayscale" : "opacity-100"}
        ${crowned ? "scale-[1.04]" : ""}
        ${voterId && !locked && !dimmed ? "cursor-pointer active:scale-[0.97]" : "cursor-default"}
      `}
      style={
        crowned
          ? { boxShadow: "0 0 40px rgba(245,197,24,0.5), 0 0 80px rgba(245,197,24,0.25)" }
          : hasVoted
            ? { boxShadow: "0 0 25px rgba(196,30,58,0.4)" }
            : undefined
      }
    >
      {/* Poster */}
      <div className={`relative aspect-[2/3] rounded-3xl overflow-hidden border-2 transition-colors
        ${crowned ? "border-theater-gold" : hasVoted ? "border-theater-red" : "border-white/15 group-hover:border-white/30"}`}>
        <img
          src={`/api/jellyfin/image?movieId=${movie.movieId}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Crown on win */}
        {crowned && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-4xl animate-bounce drop-shadow-lg">
            👑
          </div>
        )}

        {/* Locked badge */}
        {locked && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white/60 flex items-center gap-1">
            🔒 Your pick
          </div>
        )}

        {/* Voted check */}
        {hasVoted && !crowned && (
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-theater-red flex items-center justify-center shadow-lg animate-scale-in">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          <h3 className="font-display font-bold text-white text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-md">
            {movie.title}
          </h3>
          <p className="text-white/40 text-[10px] mt-0.5">
            {movie.profileEmoji} {movie.profileName}
          </p>

          {/* Vote pips */}
          <div className="flex gap-1 mt-2 min-h-[22px] flex-wrap">
            {votes &&
              Array.from(votes).map((pid) => {
                const voter = participants.find((p) => p.id === pid);
                return (
                  <span
                    key={pid}
                    title={voter?.name}
                    className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm animate-scale-in"
                  >
                    {voter?.emoji || "❓"}
                  </span>
                );
              })}
          </div>
        </div>
      </div>
    </button>
  );
}
