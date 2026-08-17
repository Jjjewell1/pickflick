"use client";

import { useState, useEffect } from "react";
import PopcornBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
  pin: string;
}

const EMOJI_OPTIONS = [
  "🍿", "🎬", "🎥", "🎞️", "🎭", "🎪", "🎤", "🎧",
  "🦊", "🐱", "🐶", "🐼", "🦁", "🐸", "🦋", "🌟",
  "🚀", "🎸", "🎮", "⚽", "🏀", "🎯", "🎨", "🔮",
  "👦", "👧", "🧑", "👨", "👩", "🧒", "👶", "🧓",
];

const AGE_TIERS = [
  { value: "kid", label: "Kid", desc: "PG max", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { value: "teen", label: "Teen", desc: "PG-13 max", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { value: "adult", label: "Adult", desc: "No limit", color: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
];

export default function SettingsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍿");
  const [ageTier, setAgeTier] = useState("adult");
  const [pin, setPin] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      setProfiles(Array.isArray(data) ? data : []);
    } catch {
      setProfiles([]);
    }
  };

  const addProfile = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          emoji,
          ageTier,
          pin: pin.length === 4 ? pin : "",
        }),
      });
      setName("");
      setEmoji("🍿");
      setAgeTier("adult");
      setPin("");
      await fetchProfiles();
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      await fetch(`/api/profiles?id=${id}`, { method: "DELETE" });
      await fetchProfiles();
    } catch {
      // Silently fail
    }
  };

  const tierColors: Record<string, string> = {
    kid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    teen: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    adult: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };

  return (
    <div className="min-h-screen relative">
      <PopcornBackground />
      <Header />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-white mb-8 text-center">
          Household Settings
        </h1>

        <div className="glass-panel p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Add Household Member
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-theater-red/50"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1.5">Avatar</label>
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-left text-2xl flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="text-white/40 text-sm">Tap to change</span>
                </button>
                {showEmojiPicker && (
                  <div className="absolute z-20 top-full mt-2 left-0 right-0 glass-panel-heavy p-3 grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        onClick={() => {
                          setEmoji(e);
                          setShowEmojiPicker(false);
                        }}
                        className={`text-2xl p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                          emoji === e ? "bg-theater-red/20 ring-1 ring-theater-red" : ""
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1.5">Age Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {AGE_TIERS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setAgeTier(t.value)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      ageTier === t.value
                        ? `${t.color} ring-2 ring-white/20`
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-semibold text-sm">{t.label}</p>
                    <p className="text-xs opacity-60">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1.5">
                PIN <span className="text-white/30">(optional, 4 digits)</span>
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-theater-red/50 tracking-[0.5em] text-center"
              />
            </div>

            <button
              onClick={addProfile}
              disabled={!name.trim() || loading}
              className="btn-primary w-full"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </div>

        {profiles.length > 0 && (
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Current Members
            </h2>
            <div className="space-y-2">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{p.name}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      tierColors[p.ageTier] || tierColors.adult
                    }`}
                  >
                    {p.ageTier}
                  </span>
                  {p.pin && (
                    <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <button
                    onClick={() => deleteProfile(p.id)}
                    className="text-white/30 hover:text-red-400 transition-colors p-1"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
