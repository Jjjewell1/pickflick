"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PopcornBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";
import GenreDeck from "@/components/GenreDeck";
import MovieBrowser from "@/components/MovieBrowser";
import KnockoutScreen from "@/components/KnockoutScreen";
import WinnerReveal from "@/components/WinnerReveal";
import HowToModal from "@/components/HowToModal";
import NominatorTransition from "@/components/NominatorTransition";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
}

interface JellyfinMovie {
  Id: string;
  Name: string;
  OfficialRating?: string;
  Genres?: string[];
  Overview?: string;
  CommunityRating?: number;
  UserData?: { Played?: boolean };
}

interface NominationEntry {
  movieId: string;
  title: string;
  poster: string | null;
  profileId: string;
  profileName: string;
  profileEmoji: string;
}

type Step = "select" | "genre" | "nominate" | "vote" | "reveal";

const STEP_META: Record<Step, { label: string; num: number }> = {
  select: { label: "Who", num: 1 },
  genre: { label: "Genre", num: 2 },
  nominate: { label: "Pick", num: 3 },
  vote: { label: "Vote", num: 4 },
  reveal: { label: "Winner", num: 5 },
};

const ratingOrder = ["G", "PG", "PG-13", "R", "NC-17", "NR", ""];

function getMaxRating(profiles: Profile[]): string {
  const tierMap: Record<string, string> = {
    kid: "PG",
    teen: "PG-13",
    adult: "",
  };
  let max = "";
  for (const p of profiles) {
    const ceiling = tierMap[p.ageTier] || "";
    if (
      max === "" ||
      (ceiling !== "" && ratingOrder.indexOf(ceiling) < ratingOrder.indexOf(max))
    ) {
      max = ceiling;
    }
  }
  return max;
}

function FilmLoader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="film-spinner" />
      <p className="text-white/40 text-sm">{text}</p>
    </div>
  );
}

export default function NightPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [maxRating, setMaxRating] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [genre, setGenre] = useState("");
  const [rerollUsed, setRerollUsed] = useState(false);
  const [movies, setMovies] = useState<JellyfinMovie[]>([]);
  const [nominations, setNominations] = useState<Map<string, NominationEntry>>(new Map());
  const [currentNominator, setCurrentNominator] = useState<string | null>(null);
  const [nominatorIndex, setNominatorIndex] = useState(0);
  const [roundMovies, setRoundMovies] = useState<NominationEntry[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [matchVotes, setMatchVotes] = useState<Map<string, Set<string>>>(new Map());
  const [resolvedWinners, setResolvedWinners] = useState<string[]>([]);
  const [roundSplash, setRoundSplash] = useState<string | null>(null);
  const [winner, setWinner] = useState<JellyfinMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHowTo, setShowHowTo] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProfiles(data);
      })
      .catch(() => {});
  }, []);

  const toggleProfile = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startNight = async () => {
    const selected = profiles.filter((p) => selectedIds.has(p.id));
    if (selected.length === 0) return;

    setSelectedProfiles(selected);
    const rating = getMaxRating(selected);
    setMaxRating(rating);
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ action: "genres" });
      const res = await fetch(`/api/jellyfin?${params}`);
      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to connect to Jellyfin";
        try { const d = JSON.parse(text); msg = d.error || msg; } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setGenres(data.genres || []);
      setStep("genre");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect to Jellyfin");
    } finally {
      setLoading(false);
    }
  };

  const onGenreSelected = useCallback(
    async (selectedGenre: string) => {
      setGenre(selectedGenre);
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          action: "movies",
          genre: selectedGenre,
          maxRating,
        });
        const res = await fetch(`/api/jellyfin?${params}`);
        if (!res.ok) {
          const text = await res.text();
          let msg = "Failed to fetch movies";
          try { const d = JSON.parse(text); msg = d.error || msg; } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        setMovies(data.movies || []);
        setCurrentNominator(selectedProfiles[0]?.id || null);
        setNominatorIndex(0);
        setStep("nominate");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    },
    [maxRating, selectedProfiles]
  );

  const handleReroll = useCallback(async () => {
    setRerollUsed(true);
    setLoading(true);
    try {
      const params = new URLSearchParams({ action: "genres" });
      const res = await fetch(`/api/jellyfin?${params}`);
      if (!res.ok) {
        const text = await res.text();
        let msg = "Failed to reroll genres";
        try { const d = JSON.parse(text); msg = d.error || msg; } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setGenres(data.genres || []);
    } catch {
      setError("Failed to reroll genres");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNominate = (movie: JellyfinMovie) => {
    if (!currentNominator) return;
    const profile = selectedProfiles.find((p) => p.id === currentNominator);
    if (!profile) return;

    setNominations((prev) => {
      const next = new Map(prev);
      if (next.has(movie.Id)) {
        next.delete(movie.Id);
      } else {
        const currentCount = Array.from(next.values()).filter(
          (n) => n.profileId === currentNominator
        ).length;
        if (currentCount < 2) {
          next.set(movie.Id, {
            movieId: movie.Id,
            title: movie.Name,
            poster: movie.Id,
            profileId: currentNominator,
            profileName: profile.name,
            profileEmoji: profile.emoji,
          });
        }
      }
      return next;
    });
  };

  const finishNominating = () => {
    const nextIndex = nominatorIndex + 1;
    if (nextIndex < selectedProfiles.length) {
      setShowTransition(true);
    } else {
      startTournament();
    }
  };

  const startTournament = () => {
    const shuffled = Array.from(nominations.values()).sort(() => Math.random() - 0.5);

    if (shuffled.length === 1) {
      crownWinner(shuffled[0].movieId);
      return;
    }

    setRoundMovies(shuffled);
    setMatchIndex(0);
    setRoundNumber(1);
    setMatchVotes(new Map());
    setResolvedWinners([]);
    setStep("vote");
    splashRound(shuffled.length);
  };

  const splashRound = (count: number) => {
    const label =
      count === 2 ? "The Final" :
      count <= 4 ? "Semi Finals" :
      count <= 8 ? "Quarter Finals" :
      `Round of ${count}`;
    setRoundSplash(label);
    setTimeout(() => setRoundSplash(null), 1500);
  };

  const handleTransitionReady = () => {
    setShowTransition(false);
    setNominatorIndex((prev) => prev + 1);
    setCurrentNominator(selectedProfiles[nominatorIndex + 1].id);
  };

  const handleVote = (movieId: string, profileId: string) => {
    const toggle = (map: Map<string, Set<string>>) => {
      const next = new Map(map);
      if (!next.has(movieId)) next.set(movieId, new Set());
      const voterSet = next.get(movieId)!;
      if (voterSet.has(profileId)) voterSet.delete(profileId);
      else voterSet.add(profileId);
      return next;
    };
    setMatchVotes(toggle);
  };

  const roundLabel = (count: number, round: number) =>
    count === 2 ? "The Final" :
    count <= 4 ? "Semi Finals" :
    count <= 8 ? "Quarter Finals" :
    `Round ${round}`;

  const handleAdvance = (winnerId: string) => {
    const totalMatches = Math.ceil(roundMovies.length / 2);
    const winners: NominationEntry[] = [];

    const roundWinnerIds = [...resolvedWinners, winnerId];
    setResolvedWinners(roundWinnerIds);

    if (matchIndex + 1 < totalMatches) {
      setMatchIndex(matchIndex + 1);
      setMatchVotes(new Map());
      return;
    }

    for (const id of roundWinnerIds) {
      const nom = roundMovies.find((n) => n.movieId === id);
      if (nom) winners.push(nom);
    }

    if (winners.length <= 1) {
      crownWinner(winnerId);
      return;
    }

    setRoundMovies(winners);
    setMatchIndex(0);
    setResolvedWinners([]);
    setMatchVotes(new Map());
    setRoundNumber(roundNumber + 1);
    splashRound(winners.length);
  };

  const crownWinner = async (winnerId: string) => {
    const movie = movies.find((m) => m.Id === winnerId);
    const nom = nominations.get(winnerId);
    setWinner(movie || null);
    setStep("reveal");

    const title = movie?.Name || nom?.title || null;
    const poster = winnerId ? `/api/jellyfin/image?movieId=${winnerId}` : null;

    try {
      const res = await fetch("/api/night", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre,
          maxRating,
          participants: Array.from(selectedIds),
          nominations: Array.from(nominations.values()),
          winnerId,
          winnerTitle: title,
          winnerPoster: poster,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to save night:", res.status, errText);
      }
    } catch (err) {
      console.error("Network error saving night:", err);
    }
  };

  const currentNomProfile = selectedProfiles.find(
    (p) => p.id === currentNominator
  );

  return (
    <div className="min-h-screen relative">
      <PopcornBackground />
      <Header onHowTo={() => setShowHowTo(true)} />
      <HowToModal open={showHowTo} onClose={() => setShowHowTo(false)} />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Step indicator — cinematic style */}
        {step !== "reveal" && (
          <div className="flex items-center justify-center gap-1 mb-8" style={{ animation: "heroRise 0.6s ease-out both" }}>
            {(Object.keys(STEP_META) as Step[]).map((s) => {
              const meta = STEP_META[s];
              const isCurrent = s === step;
              const isPast = meta.num < STEP_META[step].num;
              return (
                <div key={s} className="flex items-center gap-1">
                  <div className={`step-dot ${
                    isCurrent ? "step-dot-current" :
                    isPast ? "step-dot-done" :
                    "step-dot-pending"
                  }`}>
                    {isPast ? "✓" : meta.num}
                  </div>
                  {meta.num < 5 && (
                    <div className={`step-connector ${
                      isPast ? "bg-theater-gold/40" : "bg-white/[0.08]"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="glass-panel p-4 mb-6 border-red-500/30 bg-red-500/10">
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-400/60 text-xs mt-1 hover:text-red-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {step === "select" && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-center mb-2 bg-gradient-to-r from-theater-gold via-yellow-100 to-theater-gold bg-clip-text text-transparent drop-shadow-lg">
              WHO&apos;S WATCHING?
            </h2>
            <p className="text-white/40 text-center mb-8 text-sm">
              Select tonight&apos;s participants
            </p>

            {profiles.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <p className="text-white/40 mb-4">
                  Add household members first in Settings
                </p>
                <button
                  onClick={() => router.push("/settings")}
                  className="btn-secondary"
                >
                  Go to Settings
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {profiles.map((p, i) => {
                    const isSelected = selectedIds.has(p.id);
                    const tierColors: Record<string, string> = {
                      kid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                      teen: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      adult: "bg-sky-500/20 text-sky-300 border-sky-500/30",
                    };
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleProfile(p.id)}
                        className={`glass-panel p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                          isSelected
                            ? "ring-2 ring-theater-red bg-theater-red/10 scale-[1.05]"
                            : "hover:bg-white/5 hover:scale-[1.02]"
                        }`}
                        style={{
                          animation: `staggerFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.06 * i}s both`,
                        }}
                      >
                        <span className="text-3xl">{p.emoji}</span>
                        <span className="font-semibold text-white text-sm">
                          {p.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            tierColors[p.ageTier] || tierColors.adult
                          }`}
                        >
                          {p.ageTier}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-center">
                  <button
                    onClick={startNight}
                    disabled={selectedIds.size === 0 || loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="film-spinner film-spinner-sm" />
                        Loading...
                      </span>
                    ) : "Continue →"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === "genre" && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-center mb-2 bg-gradient-to-r from-theater-gold via-yellow-100 to-theater-gold bg-clip-text text-transparent drop-shadow-lg">
              PICK A GENRE
            </h2>
            <p className="text-white/40 text-center mb-8 text-sm">
              Shuffle the deck to tonight&apos;s genre
              {maxRating && (
                <span className="block mt-1 text-amber-300/60">
                  Content ceiling: {maxRating}
                </span>
              )}
            </p>

            {loading ? (
              <FilmLoader text="Loading genres..." />
            ) : (
              <GenreDeck
                genres={genres}
                onGenreSelected={onGenreSelected}
                canReroll={!rerollUsed}
                onReroll={handleReroll}
              />
            )}
          </div>
        )}

        {step === "nominate" && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-center mb-2 bg-gradient-to-r from-theater-gold via-yellow-100 to-theater-gold bg-clip-text text-transparent drop-shadow-lg">
              NOMINATE MOVIES
            </h2>
            <p className="text-white/40 text-center mb-2 text-sm">
              Genre: <span className="text-theater-gold">{genre}</span>
            </p>

            {currentNomProfile && (
              <div className="text-center mb-6">
                <p className="text-white/50 text-sm mb-2">
                  {currentNomProfile.emoji} {currentNomProfile.name}&apos;s turn
                </p>
                <p className="text-white/30 text-xs">
                  Pick 1–2 movies, then tap Done
                </p>
              </div>
            )}

            {loading ? (
              <FilmLoader text="Loading movies..." />
            ) : (
              <>
                <MovieBrowser
                  movies={movies}
                  onNominate={handleNominate}
                  nominations={nominations}
                  maxNominations={2}
                  currentNominations={Array.from(nominations.values()).filter(
                    (n) => n.profileId === currentNominator
                  ).length}
                />

                {nominations.size > 0 && (
                  <div className="mt-6">
                    <h3 className="font-display text-xl tracking-wide text-white mb-3">
                      NOMINATED ({nominations.size})
                    </h3>
                    <div className="space-y-2">
                      {Array.from(nominations.entries()).map(([movieId, nom], i) => (
                        <div
                          key={movieId}
                          className="glass-panel p-3 flex items-center gap-3"
                          style={{
                            animation: `staggerFadeIn 0.4s cubic-bezier(0.22,1,0.36,1) ${0.05 * i}s both`,
                          }}
                        >
                          <img
                            src={`/api/jellyfin/image?movieId=${movieId}`}
                            alt={nom.title}
                            className="w-12 h-16 rounded-lg object-cover bg-black/30 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{nom.title}</p>
                            <p className="text-white/40 text-xs">{nom.profileEmoji} {nom.profileName}</p>
                          </div>
                          {nom.profileId === currentNominator && (
                            <button
                              onClick={() => handleNominate({ Id: movieId, Name: nom.title } as JellyfinMovie)}
                              className="text-red-400/60 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center mt-6">
                  <button onClick={finishNominating} className="btn-primary">
                    {nominatorIndex < selectedProfiles.length - 1
                      ? "Done — Next Person →"
                      : "Done — Start Voting →"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === "vote" && roundMovies.length >= 2 && (
          <div className="animate-fade-in-up">
            <KnockoutScreen
              movieA={roundMovies[matchIndex * 2]}
              movieB={roundMovies[matchIndex * 2 + 1] || null}
              participants={selectedProfiles.map((p) => ({
                id: p.id,
                name: p.name,
                emoji: p.emoji,
              }))}
              votes={matchVotes}
              onVote={handleVote}
              onAdvance={handleAdvance}
              roundLabel={roundLabel(roundMovies.length, roundNumber)}
              matchLabel={`Match ${matchIndex + 1} of ${Math.ceil(roundMovies.length / 2)}`}
              isFinal={roundMovies.length === 2}
              remainingCount={roundMovies.length}
            />
          </div>
        )}

        {step === "vote" && roundMovies.length < 2 && (
          <div className="text-center py-12 text-white/40">
            Need at least 2 nominations to vote — go back and pick more!
          </div>
        )}

        {roundSplash && (
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <div className="relative text-center" style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <p className="text-theater-gold/60 text-xs uppercase tracking-[0.35em] mb-3">
                Next up
              </p>
              <h2 className="font-display text-5xl sm:text-7xl tracking-wider bg-gradient-to-r from-theater-gold via-yellow-100 to-theater-gold bg-clip-text text-transparent drop-shadow-2xl">
                {roundSplash}
              </h2>
              <p className="text-5xl mt-4" style={{ animation: "bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}>🍿</p>
            </div>
          </div>
        )}

        {step === "reveal" && winner && (
          <div className="animate-fade-in-up">
            <WinnerReveal
              title={winner.Name}
              poster={
                winner.Id
                  ? `/api/jellyfin/image?movieId=${winner.Id}`
                  : null
              }
              overview={winner.Overview || null}
              jellyfinUrl={process.env.NEXT_PUBLIC_JELLYFIN_URL || "#"}
              jellyfinItemId={winner.Id}
            />

            <div className="text-center mt-12">
              <button
                onClick={() => router.push("/")}
                className="btn-secondary"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}
      </main>

      {showTransition && currentNomProfile && (
        <NominatorTransition
          currentProfile={selectedProfiles[nominatorIndex + 1]}
          previousProfile={currentNomProfile}
          remainingProfiles={selectedProfiles.slice(nominatorIndex + 1)}
          isLast={nominatorIndex + 1 >= selectedProfiles.length - 1}
          onReady={handleTransitionReady}
        />
      )}
    </div>
  );
}
