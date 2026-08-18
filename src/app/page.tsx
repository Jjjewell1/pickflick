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
  kid: { label: "KID", color: "text-emerald-300" },
  teen: { label: "TEEN", color: "text-amber-300" },
  adult: { label: "ADULT", color: "text-sky-300" },
};

function TicketCard({
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
      <button onClick={onClick} className="ticket-card group w-full">
        <div className="ticket-inner flex items-stretch min-h-[136px]">
          {/* Stub */}
          <div className="relative w-12 flex flex-col items-center justify-center gap-1.5 border-r border-dashed border-theater-gold/25 flex-shrink-0">
            <span className={`text-[10px] font-black tracking-widest ${tier.color}`}>
              {tier.label}
            </span>
            <span
              className="text-[7px] uppercase tracking-[0.3em] text-white/20 whitespace-nowrap"
              style={{ writingMode: "vertical-rl" }}
            >
              Admit One
            </span>
          </div>

          {/* Main */}
          <div className="relative flex-1 flex flex-col items-center justify-center gap-2.5 py-5 px-2 min-w-0">
            <span className="absolute top-2 right-2 text-[8px] font-mono text-white/20 tracking-wider">
              Nº {String(index + 1).padStart(3, "0")}
            </span>

            <span className="text-5xl group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300 drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]">
              {profile.emoji}
            </span>
            <span className="font-display font-bold text-white text-sm tracking-wide group-hover:text-theater-gold transition-colors duration-300 truncate max-w-full px-1">
              {profile.name}
            </span>

            {profile.pin && (
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-theater-gold/80"
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

          {/* Barcode edge */}
          <div className="flex items-center pr-2.5 sm:pr-3 flex-shrink-0">
            <div className="ticket-barcode" />
          </div>

          {/* Punch notches on the tear line */}
          <span className="ticket-punch ticket-punch-top" />
          <span className="ticket-punch ticket-punch-bottom" />

          {/* Shine sweep */}
          <span className="ticket-shine" />
        </div>
      </button>
    </div>
  );
}

function AddTicket({ delay, onClick }: { delay: number; onClick: () => void }) {
  return (
    <div style={{ animation: `ticketIn 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both` }}>
      <button
        onClick={onClick}
        className="group relative w-full rounded-[1.1rem] border-2 border-dashed border-white/15 hover:border-theater-gold/60 bg-white/[0.02] hover:bg-theater-gold/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_30px_rgba(245,197,24,0.12)] flex flex-col items-center justify-center gap-3 min-h-[136px]"
      >
        <span className="w-11 h-11 rounded-full border-2 border-white/15 group-hover:border-theater-gold/70 group-hover:bg-theater-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-90">
          <svg
            className="w-5 h-5 text-white/30 group-hover:text-theater-gold transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
        <span className="text-white/30 group-hover:text-theater-gold/90 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300">
          New Ticket
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
      <PopcornBackground />
      <VelvetCurtain />
      <HowToModal open={showHowTo} onClose={() => setShowHowTo(false)} />

      {!selectedProfile ? (
        <>
          {/* Top bar — glass pill nav */}
          <header
            className="relative z-30 flex items-center justify-between px-5 py-4 mt-24 sm:mt-28"
            style={{ animation: "heroRise 0.7s ease-out both" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎟️</span>
              <span className="font-display text-sm font-bold text-white/60 tracking-wide hidden sm:inline">
                Box Office
              </span>
            </div>

            <nav className="flex items-center gap-1 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-lg">
              <button
                onClick={() => setShowHowTo(true)}
                className="px-4 py-1.5 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                How To
              </button>
              <a
                href="/history"
                className="px-4 py-1.5 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                History
              </a>
              <a
                href="/settings"
                className="px-4 py-1.5 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                Settings
              </a>
            </nav>
          </header>

          <main className="relative z-30 flex-1 flex flex-col items-center px-4 pb-20 pt-2">
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* Hero marquee */}
              <Marquee />

              {/* NOW SHOWING divider */}
              <div
                className="flex items-center gap-3 sm:gap-4 w-full max-w-lg mt-12 mb-10"
                style={{ animation: "heroRise 0.7s ease-out 0.25s both" }}
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-theater-gold/50" />
                <span className="flex items-center gap-2.5">
                  <span className="text-theater-gold/50 text-xs">✦</span>
                  <span className="shimmer-text text-xs sm:text-sm font-bold uppercase tracking-[0.35em]">
                    Now Showing
                  </span>
                  <span className="text-theater-gold/50 text-xs">✦</span>
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-theater-gold/50" />
              </div>

              {/* Profile tickets */}
              {profiles.length === 0 ? (
                <div
                  className="glass-panel p-10 text-center max-w-sm"
                  style={{ animation: "heroRise 0.7s ease-out 0.4s both" }}
                >
                  <p className="text-5xl mb-4">🍿</p>
                  <p className="text-white/50 mb-6 text-sm">
                    No tickets yet — add your household to get started
                  </p>
                  <a href="/settings" className="btn-primary inline-block">
                    + Create Profile
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-4xl">
                  {profiles.map((p, i) => (
                    <TicketCard
                      key={p.id}
                      profile={p}
                      index={i}
                      onClick={() => handleProfileClick(p)}
                    />
                  ))}
                  <AddTicket
                    delay={0.35 + profiles.length * 0.09}
                    onClick={() => router.push("/settings")}
                  />
                </div>
              )}

              {/* Hint */}
              <p
                className="mt-12 text-white/30 text-xs flex items-center gap-2"
                style={{ animation: "heroRise 0.7s ease-out 0.9s both" }}
              >
                <span className="inline-block animate-bounce">🎟️</span>
                Tap a ticket to start the show
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
