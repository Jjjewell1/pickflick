"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PopcornBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";
import GenreWheel from "@/components/GenreWheel";
import MovieBrowser from "@/components/MovieBrowser";
import VoteScreen from "@/components/VoteScreen";
import WinnerReveal from "@/components/WinnerReveal";

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
  const [votes, setVotes] = useState<Map<string, Set<string>>>(new Map());
  const [winner, setWinner] = useState<JellyfinMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        const data = await res.json();
        throw new Error(data.error || "Failed to connect to Jellyfin");
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
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch movies");
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
      setNominatorIndex(nextIndex);
      setCurrentNominator(selectedProfiles[nextIndex].id);
    } else {
      setStep("vote");
    }
  };

  const handleVote = (movieId: string, profileId: string) => {
    setVotes((prev) => {
      const next = new Map(prev);
      if (!next.has(movieId)) {
        next.set(movieId, new Set());
      }
      const voterSet = next.get(movieId)!;
      if (voterSet.has(profileId)) {
        voterSet.delete(profileId);
      } else {
        voterSet.add(profileId);
      }
      return next;
    });
  };

  const handleRevealWinner = async () => {
    let bestMovieId = "";
    let bestCount = 0;

    for (const [movieId, voterSet] of Array.from(votes.entries())) {
      if (voterSet.size > bestCount) {
        bestCount = voterSet.size;
        bestMovieId = movieId;
      }
    }

    if (!bestMovieId && nominations.size > 0) {
      bestMovieId = Array.from(nominations.keys())[0];
    }

    const movie = movies.find((m) => m.Id === bestMovieId);
    setWinner(movie || null);
    setStep("reveal");

    try {
      await fetch("/api/night", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre,
          maxRating,
          participants: Array.from(selectedIds),
          nominations: Array.from(nominations.values()),
          votes: Array.from(votes.entries()).flatMap(([movieId, voterSet]) =>
            Array.from(voterSet).map((profileId) => ({ movieId, profileId }))
          ),
        }),
      });
    } catch {
      // Silently fail — the reveal still works
    }
  };

  const currentNomProfile = selectedProfiles.find(
    (p) => p.id === currentNominator
  );

  return (
    <div className="min-h-screen relative">
      <PopcornBackground />
      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="glass-panel p-4 mb-6 border-red-500/30 bg-red-500/10">
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-400/60 text-xs mt-1 hover:text-red-400"
            >
              Dismiss
            </button>
          </div>
        )}

        {step === "select" && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-3xl font-bold text-white text-center mb-2">
              Who&apos;s Watching?
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
                  {profiles.map((p) => {
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
                    {loading ? "Loading..." : "Continue →"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === "genre" && (
          <div className="animate-fade-in-up">
            <h2 className="font-display text-3xl font-bold text-white text-center mb-2">
              Pick a Genre
            </h2>
            <p className="text-white/40 text-center mb-8 text-sm">
              Spin the wheel to tonight&apos;s genre
              {maxRating && (
                <span className="block mt-1 text-amber-300/60">
                  Content ceiling: {maxRating}
                </span>
              )}
            </p>

            {loading ? (
              <div className="text-center py-12 text-white/40">
                Loading genres...
              </div>
            ) : (
              <GenreWheel
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
            <h2 className="font-display text-3xl font-bold text-white text-center mb-2">
              Nominate Movies
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
              <div className="text-center py-12 text-white/40">
                Loading movies...
              </div>
            ) : (
              <>
                <MovieBrowser
                  movies={movies}
                  posterBaseUrl={process.env.NEXT_PUBLIC_JELLYFIN_URL || ""}
                  nominations={nominations}
                  onNominate={handleNominate}
                  maxNominations={2}
                  currentNominations={Array.from(nominations.values()).filter(
                    (n) => n.profileId === currentNominator
                  ).length}
                />

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

        {step === "vote" && (
          <div className="animate-fade-in-up">
            <VoteScreen
              nominations={Array.from(nominations.values()).map((n, i) => ({
                ...n,
                id: `nom-${i}`,
              }))}
              participants={selectedProfiles.map((p) => ({
                id: p.id,
                name: p.name,
                emoji: p.emoji,
              }))}
              votes={votes}
              onVote={handleVote}
              onComplete={handleRevealWinner}
            />
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
    </div>
  );
}
