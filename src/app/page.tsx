"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PopcornBackground from "@/components/PopcornBackground";
import PinPad from "@/components/PinPad";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
  pin: string;
}

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [pinError, setPinError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => setProfiles(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleProfileClick = (profile: Profile) => {
    if (!profile.pin) {
      sessionStorage.setItem("pickflick_profile", JSON.stringify(profile));
      router.push("/night");
      return;
    }
    setSelectedProfile(profile);
    setPinError("");
  };

  const handlePinVerify = async (pin: string) => {
    if (!selectedProfile) return;
    setLoading(true);
    setPinError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: selectedProfile.id, pin }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("pickflick_profile", JSON.stringify(data.profile));
        router.push("/night");
      } else {
        setPinError("Wrong PIN — try again");
        setPinError("");
        setTimeout(() => setPinError("Wrong PIN — try again"), 50);
      }
    } catch {
      setPinError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <PopcornBackground />

      {!selectedProfile && (
        <header className="relative z-10 flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎬</span>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              <span className="text-white">Pick</span>
              <span className="text-theater-red">Flick</span>
            </h1>
          </div>
          <nav className="flex items-center gap-1">
            <a href="/history" className="px-3 py-1.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
              History
            </a>
            <a href="/settings" className="px-3 py-1.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
              Settings
            </a>
          </nav>
        </header>
      )}

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-12">
        {!selectedProfile ? (
          <div className="animate-fade-in-up">
            <h2 className="text-center text-white/60 text-sm uppercase tracking-widest mb-8 font-medium">
              Who&apos;s watching?
            </h2>

            {profiles.length === 0 ? (
              <div className="glass-panel p-10 text-center max-w-sm">
                <p className="text-5xl mb-4">🍿</p>
                <p className="text-white/50 mb-5 text-sm">
                  No profiles yet — add your household to get started
                </p>
                <a href="/settings" className="btn-primary inline-block">
                  + Create Profile
                </a>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-5 max-w-2xl">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProfileClick(p)}
                    className="group flex flex-col items-center gap-3 w-32"
                  >
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 group-hover:border-theater-red group-hover:shadow-lg group-hover:shadow-theater-red/20 transition-all duration-300 group-hover:scale-105 flex items-center justify-center text-6xl">
                      {p.emoji}
                      {p.pin && (
                        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      {p.name}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => router.push("/settings")}
                  className="flex flex-col items-center gap-3 w-32 group"
                >
                  <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-300 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/20 group-hover:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-white/30 text-sm group-hover:text-white/50 transition-colors">
                    Add
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <PinPad
            profileName={selectedProfile.name}
            profileEmoji={selectedProfile.emoji}
            onVerify={handlePinVerify}
            onCancel={() => setSelectedProfile(null)}
            error={pinError}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}
