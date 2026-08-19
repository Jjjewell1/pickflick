"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TechBackground from "@/components/PopcornBackground";
import PinPad from "@/components/PinPad";
import HowToModal from "@/components/HowToModal";
import Marquee from "@/components/Marquee";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
  pin: string;
}

const TIER_META: Record<string, { label: string; color: string }> = {
  kid: { label: "KID", color: "text-emerald-400" },
  teen: { label: "TEEN", color: "text-amber-400" },
  adult: { label: "ADULT", color: "text-cyan" },
};

function AccessCard({
  profile,
  index,
  onClick,
}: {
  profile: Profile;
  index: number;
  onClick: () => void;
}) {
  const tier = TIER_META[profile.ageTier] || TIER_META.adult;

  return (
    <div
      style={{
        animation: `ticketIn 0.7s cubic-bezier(0.34,1.56,0.64,1) ${0.35 + index * 0.09}s both`,
      }}
    >
      <button onClick={onClick} className="access-card group w-full text-left">
        <div className="access-card-inner flex items-stretch min-h-[160px] p-0">
          {/* Corner brackets */}
          <span className="access-card-corner access-card-corner-tl" style={{ borderColor: "rgba(0,229,255,0.25)" }} />
          <span className="access-card-corner access-card-corner-tr" style={{ borderColor: "rgba(0,229,255,0.25)" }} />
          <span className="access-card-corner access-card-corner-bl" style={{ borderColor: "rgba(0,229,255,0.25)" }} />
          <span className="access-card-corner access-card-corner-br" style={{ borderColor: "rgba(0,229,255,0.25)" }} />

          {/* Left: avatar zone */}
          <div className="relative w-24 sm:w-28 flex flex-col items-center justify-center gap-2 flex-shrink-0 border-r border-white/[0.06]">
            {/* Glow ring behind emoji */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full blur-[20px] bg-cyan/10 group-hover:bg-cyan/20 transition-all duration-500" />
            </div>

            <span className="text-4xl sm:text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]">
              {profile.emoji}
            </span>
          </div>

          {/* Right: info */}
          <div className="relative flex-1 flex flex-col justify-center gap-2 py-5 px-3 sm:px-4 min-w-0">
            {/* Tier + serial */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-[0.2em] ${tier.color}`}>
                {tier.label}
              </span>
              <span className="text-[8px] font-mono text-white/15 tracking-wider">
                Nº {String(index + 1).padStart(3, "0")}
              </span>
            </div>

            {/* Name */}
            <span className="font-display font-bold text-silver-light text-sm sm:text-base tracking-wide group-hover:text-cyan transition-colors duration-300 truncate">
              {profile.name}
            </span>

            {/* Access line */}
            <div className="flex items-center gap-1.5">
              <div className="h-px flex-1 bg-gradient-to-r from-cyan/20 to-transparent" />
              <span className="text-[7px] font-mono text-cyan/30 uppercase tracking-[0.2em]">
                Access
              </span>
            </div>

            {/* Lock icon */}
            {profile.pin && (
              <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-cyan/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            )}
          </div>

          {/* Shine sweep */}
          <span className="access-card-shine" />
        </div>
      </button>
    </div>
  );
}

function AddCard({ delay, onClick }: { delay: number; onClick: () => void }) {
  return (
    <div style={{ animation: `ticketIn 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both` }}>
      <button
        onClick={onClick}
        className="group relative w-full rounded-xl border border-dashed border-white/[0.08] hover:border-cyan/40 bg-white/[0.02] hover:bg-cyan/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_30px_rgba(0,229,255,0.08)] flex flex-col items-center justify-center gap-3 min-h-[160px]"
      >
        <span className="w-11 h-11 rounded-full border border-white/[0.08] group-hover:border-cyan/40 group-hover:bg-cyan/[0.06] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-90">
          <svg
            className="w-5 h-5 text-white/20 group-hover:text-cyan/70 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
        <span className="text-white/20 group-hover:text-cyan/70 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300">
          Add Access
        </span>
      </button>
    </div>
  );
}

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
      }
    } catch {
      setPinError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <TechBackground />
      <HowToModal open={showHowTo} onClose={() => setShowHowTo(false)} />

      {!selectedProfile ? (
        <>
          {/* Top bar — glass pill nav */}
          <header
            className="relative z-30 flex items-center justify-between px-5 py-4 mt-24 sm:mt-28"
            style={{ animation: "heroRise 0.7s ease-out both" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-cyan/60 shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              <span className="font-display text-[10px] font-bold text-silver-dark/60 tracking-[0.15em] uppercase hidden sm:inline">
                PickFlick
              </span>
            </div>

            <nav className="flex items-center gap-1 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-full p-1 shadow-lg">
              <button
                onClick={() => setShowHowTo(true)}
                className="px-4 py-1.5 rounded-full text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                How To
              </button>
              <a
                href="/history"
                className="px-4 py-1.5 rounded-full text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                History
              </a>
              <a
                href="/settings"
                className="px-4 py-1.5 rounded-full text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Settings
              </a>
            </nav>
          </header>

          <main className="relative z-30 flex-1 flex flex-col items-center px-4 pb-20 pt-2">
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* Hero marquee */}
              <Marquee />

              {/* SELECT ACCESS divider */}
              <div
                className="flex items-center gap-3 sm:gap-4 w-full max-w-lg mt-12 mb-10"
                style={{ animation: "heroRise 0.7s ease-out 0.25s both" }}
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
                <span className="flex items-center gap-2.5">
                  <span className="text-cyan/30 text-xs">◆</span>
                  <span className="shimmer-text text-xs sm:text-sm font-bold uppercase tracking-[0.35em]">
                    Select Access
                  </span>
                  <span className="text-cyan/30 text-xs">◆</span>
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan/15 to-transparent" />
              </div>

              {/* Profile access cards */}
              {profiles.length === 0 ? (
                <div
                  className="glass-panel p-10 text-center max-w-sm"
                  style={{ animation: "heroRise 0.7s ease-out 0.4s both" }}
                >
                  <p className="text-5xl mb-4">◈</p>
                  <p className="text-silver-dark/60 mb-6 text-sm">
                    No profiles yet — add your household to get started
                  </p>
                  <a href="/settings" className="btn-primary inline-block">
                    + Create Profile
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-4xl">
                  {profiles.map((p, i) => (
                    <AccessCard
                      key={p.id}
                      profile={p}
                      index={i}
                      onClick={() => handleProfileClick(p)}
                    />
                  ))}
                  <AddCard
                    delay={0.35 + profiles.length * 0.09}
                    onClick={() => router.push("/settings")}
                  />
                </div>
              )}

              {/* Hint */}
              <p
                className="mt-12 text-silver-dark/30 text-xs flex items-center gap-2"
                style={{ animation: "heroRise 0.7s ease-out 0.9s both" }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan/30 animate-pulse" />
                Select a profile to begin
              </p>
            </div>
          </main>
        </>
      ) : (
        <main className="relative z-30 flex-1 flex items-center justify-center px-4 pt-24">
          <PinPad
            profileName={selectedProfile.name}
            profileEmoji={selectedProfile.emoji}
            onVerify={handlePinVerify}
            onCancel={() => setSelectedProfile(null)}
            error={pinError}
            loading={loading}
          />
        </main>
      )}
    </div>
  );
}
