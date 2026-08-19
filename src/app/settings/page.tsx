"use client";

import { useState, useEffect } from "react";
import TechBackground from "@/components/PopcornBackground";
import Header from "@/components/Header";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
  pin: string;
}

const EMOJI_OPTIONS = [
  "🎬", "🎥", "🎞️", "🎭", "🎪", "🎤", "🎧", "🎵",
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
  const [emoji, setEmoji] = useState("🎬");
  const [ageTier, setAgeTier] = useState("adult");
  const [pin, setPin] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const resetForm = () => {
    setName("");
    setEmoji("🎬");
    setAgeTier("adult");
    setPin("");
    setEditingId(null);
    setShowEmojiPicker(false);
  };

  const saveProfile = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      if (editingId) {
        const body: Record<string, string> = {
          id: editingId,
          name: name.trim(),
          emoji,
          ageTier,
        };
        if (pin.length === 4) body.pin = pin;
        await fetch("/api/profiles", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
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
      }
      resetForm();
      await fetchProfiles();
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const editProfile = (p: Profile) => {
    setName(p.name);
    setEmoji(p.emoji);
    setAgeTier(p.ageTier);
    setPin("");
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removePin = async (p: Profile) => {
    try {
      await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, pin: "" }),
      });
      await fetchProfiles();
    } catch {
      // Silently fail
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      await fetch(`/api/profiles?id=${id}`, { method: "DELETE" });
      if (editingId === id) resetForm();
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
      <TechBackground />
      <Header />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-white mb-8 text-center">
          Household Settings
        </h1>

        <div className="glass-panel p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingId ? "Edit Member" : "Add Household Member"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-silver-dark/60 text-sm mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/50"
              />
            </div>

            <div>
              <label className="block text-silver-dark/60 text-sm mb-1.5">Avatar</label>
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-left text-2xl flex items-center gap-3 hover:bg-white/10 transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="text-silver-dark/40 text-sm">Tap to change</span>
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
                          emoji === e ? "bg-cyan/20 ring-1 ring-cyan" : ""
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
              <label className="block text-silver-dark/60 text-sm mb-1.5">Age Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {AGE_TIERS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setAgeTier(t.value)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      ageTier === t.value
                        ? `${t.color} ring-2 ring-white/20`
                        : "bg-white/5 border-white/[0.08] text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-semibold text-sm">{t.label}</p>
                    <p className="text-xs opacity-60">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-silver-dark/60 text-sm mb-1.5">
                {editingId ? (
                  <>New PIN <span className="text-white/30">(leave blank to keep current)</span></>
                ) : (
                  <>PIN <span className="text-white/30">(optional, 4 digits)</span></>
                )}
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-cyan/50 tracking-[0.5em] text-center"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={!name.trim() || loading}
                className="btn-primary flex-1"
              >
                {loading ? "Saving..." : editingId ? "Save Changes" : "Add Member"}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
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
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    editingId === p.id ? "bg-cyan/10 ring-1 ring-cyan/40" : "bg-white/5"
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                    <p className="text-silver-dark/40 text-xs">
                      {p.ageTier}
                      {p.pin && " · 🔒"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      tierColors[p.ageTier] || tierColors.adult
                    }`}
                  >
                    {p.ageTier}
                  </span>
                  {p.pin && (
                    <button
                      onClick={() => removePin(p)}
                      className="text-silver-dark/30 hover:text-amber-300 transition-colors p-1"
                      title="Remove PIN"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 4v.01M12 11v4m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => editProfile(p)}
                    className="text-silver-dark/30 hover:text-cyan transition-colors p-1"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteProfile(p.id)}
                    className="text-silver-dark/30 hover:text-red-400 transition-colors p-1"
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
