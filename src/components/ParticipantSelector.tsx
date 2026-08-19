"use client";

import { useState } from "react";

interface Profile {
  id: string;
  name: string;
  emoji: string;
  ageTier: string;
}

interface ParticipantSelectorProps {
  profiles: Profile[];
  onSelectionChange?: (selected: Profile[]) => void;
}

export default function ParticipantSelector({
  profiles,
}: ParticipantSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tierColors: Record<string, string> = {
    kid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    teen: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    adult: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {profiles.map((p) => {
        const isSelected = selected.has(p.id);
        return (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`glass-panel p-4 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "ring-2 ring-cyan bg-cyan/10 scale-[1.05]"
                  : "hover:bg-white/5 hover:scale-[1.02]"
              }`}
          >
            <span className="text-3xl">{p.emoji}</span>
            <span className="font-semibold text-white text-sm">{p.name}</span>
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
  );
}
