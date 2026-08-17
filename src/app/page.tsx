"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PopcornBackground from "@/components/PopcornBackground";
import PinPad from "@/components/PinPad";
import HowToModal from "@/components/HowToModal";
import Marquee from "@/components/Marquee";
import VelvetCurtain from "@/components/VelvetCurtain";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
  pin: string;
}

const TIER_META: Record<string, { label: string; color: string }> = {
  kid: { label: "K", color: "text-emerald-300" },
  teen: { label: "T", color: "text-amber-300" },
  adult: { label: "A", color: "text-sky-300" },
};

export default function Home() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [pinError, setPinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

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
      <VelvetCurtain />
      <HowToModal open={showHowTo} onClose={() => setShowHowTo(false)} />

      {!selectedProfile && (
        <header className="relative z-30 flex items-center justify-between px-5 py-3 mt-16 sm:mt-20">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎟️</span>
            <span className="font-display text-sm font-bold text-white/60 tracking-wide hidden sm:inline">
              Box Office
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setShowHowTo(true)}
              className="px-3 py-1.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              How To
            </button>
            <a href="/history" className="px-3 py-1.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
              History
            </a>
            <a href="/settings" className="px-3 py-1.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
              Settings
            </a>
          </nav>
        </header>
      )}

      <main className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-6">
        {!selectedProfile ? (
          <div className="animate-fade-in-up w-full max-w-3xl flex flex-col items-center">
            <Marquee />

            <h2 className="mt-10 mb-8 text-center text-white/50 text-sm uppercase tracking-[0.3em] font-medium">
              ✨ Who&apos;s watching tonight? ✨
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
              <div className="flex flex-wrap justify-center gap-4">
                {profiles.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => handleProfileClick(p)}
                    className="group relative w-44 sm:w-48 transition-transform duration-300 hover:scale-105 hover:-rotate-1"
                    style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}
                  >
                    <div className="relative rounded-2xl border-2 border-theater-gold/50 bg-gradient-to-b from-[#2a0a12] to-[#120406] shadow-[0_8px_24px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(245,197,24,0.3)] transition-shadow overflow-hidden">
                      {/* Punch holes */}
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0D0508] border border-theater-gold/40 z-10" />
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0D0508] border border-theater-gold/40 z-10" />

                      <div className="flex items-stretch">
                        {/* Stub — age tier */}
                        <div className="flex flex-col items-center justify-center gap-1 px-2.5 py-4 border-r-2 border-dashed border-theater-gold/30 w-11">
                          <span className={`text-xs font-black ${TIER_META[p.ageTier]?.color || "text-white/50"}`}>
                            {TIER_META[p.ageTier]?.label || "?"}
                          </span>
                          <span className="text-[8px] uppercase tracking-wider text-white/30 -rotate-90 origin-center whitespace-nowrap">
                            {p.ageTier}
                          </span>
                        </div>

                        {/* Main */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-5 px-2">
                          <div className="relative">
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">
                              {p.emoji}
                            </span>
                            {p.pin && (
                              <div className="absolute -bottom-1 -right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-theater-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-display font-bold text-white text-sm group-hover:text-theater-gold transition-colors">
                            {p.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Add profile — dashed ticket */}
                <button
                  onClick={() => router.push("/settings")}
                  className="group relative w-44 sm:w-48 transition-transform duration-300 hover:scale-105 hover:rotate-1"
                  style={{ animation: `fadeInUp 0.5s ease-out ${profiles.length * 0.08}s both` }}
                >
                  <div className="relative rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] group-hover:border-theater-gold/40 transition-colors overflow-hidden flex items-center justify-center min-h-[120px]">
                    <div className="flex flex-col items-center gap-2 py-5">
                      <svg className="w-10 h-10 text-white/20 group-hover:text-theater-gold/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-white/30 text-sm group-hover:text-theater-gold/70 transition-colors">
                        Add Profile
                      </span>
                    </div>
                  </div>
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
