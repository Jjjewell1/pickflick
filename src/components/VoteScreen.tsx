"use client";

import { useState } from "react";

interface Nomination {
  id?: string;
  movieId: string;
  title: string;
  poster: string | null;
  profileId: string;
  profileName: string;
  profileEmoji: string;
}

interface VoteScreenProps {
  nominations: Nomination[];
  participants: { id: string; name: string; emoji: string }[];
  votes: Map<string, Set<string>>;
  onVote: (nominationId: string, profileId: string) => void;
  onComplete: () => void;
}

export default function VoteScreen({
  nominations,
  participants,
  votes,
  onVote,
  onComplete,
}: VoteScreenProps) {
  const [voterId, setVoterId] = useState<string | null>(null);

  const uniqueNominations = Array.from(
    new Map(nominations.map((n) => [n.movieId, n])).values()
  );

  const getVoteCount = (movieId: string) => {
    return votes.get(movieId)?.size || 0;
  };

  const hasVoted = (movieId: string, pid: string) => {
    return votes.get(movieId)?.has(pid) || false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Cast Your Votes!
        </h2>
        <p className="text-white/50 text-sm">
          Tap your name, then tap a movie to vote
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {participants.map((p) => (
          <button
            key={p.id}
            onClick={() => setVoterId(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              voterId === p.id
                ? "bg-theater-red text-white ring-2 ring-theater-red/50 scale-105"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <span className="text-lg">{p.emoji}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {uniqueNominations.map((nom) => {
          const count = getVoteCount(nom.movieId);
          const voterHasVoted = voterId ? hasVoted(nom.movieId, voterId) : false;

          return (
            <div
              key={nom.movieId}
              className={`glass-panel p-4 flex items-center gap-4 transition-all ${
                voterId && !voterHasVoted
                  ? "hover:bg-white/5 cursor-pointer active:scale-[0.98]"
                  : ""
              }`}
              onClick={() => {
                if (voterId && !voterHasVoted) {
                  onVote(nom.movieId, voterId);
                }
              }}
            >
              {nom.poster ? (
                <img
                  src={`/api/jellyfin/image?movieId=${nom.movieId}`}
                  alt={nom.title}
                  className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-black/30"
                />
              ) : (
                <div className="w-12 h-16 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                  🎬
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">
                  {nom.title}
                </h3>
                <p className="text-white/40 text-xs">
                  Nominated by {nom.profileEmoji} {nom.profileName}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex -space-x-1">
                  {votes.get(nom.movieId) &&
                    Array.from(votes.get(nom.movieId)!).map((pid) => {
                      const voter = participants.find((p) => p.id === pid);
                      return voter ? (
                        <span
                          key={pid}
                          className="text-lg"
                          title={voter.name}
                        >
                          {voter.emoji}
                        </span>
                      ) : null;
                    })}
                </div>
                <span
                  className={`text-lg font-bold min-w-[2ch] text-center ${
                    count > 0 ? "text-theater-gold" : "text-white/30"
                  }`}
                >
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {!voterId && (
        <p className="text-center text-white/30 text-sm mt-4">
          ☝️ Select your name above to start voting
        </p>
      )}

      {uniqueNominations.length > 0 && (
        <div className="text-center pt-4">
          <button onClick={onComplete} className="btn-primary">
            Reveal Winner! 🎉
          </button>
        </div>
      )}
    </div>
  );
}
