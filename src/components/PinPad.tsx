"use client";

import { useState, useEffect } from "react";

interface PinPadProps {
  profileName: string;
  profileEmoji: string;
  onVerify: (pin: string) => void;
  onCancel: () => void;
  error?: string;
  loading?: boolean;
}

export default function PinPad({
  profileName,
  profileEmoji,
  onVerify,
  onCancel,
  error,
  loading,
}: PinPadProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDigit = (d: string) => {
    if (activeIndex >= 4 || loading) return;
    const next = [...digits];
    next[activeIndex] = d;
    setDigits(next);

    if (activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    } else {
      const pin = next.join("");
      if (pin.length === 4) {
        onVerify(pin);
      }
    }
  };

  const handleDelete = () => {
    if (loading) return;
    if (activeIndex > 0 && digits[activeIndex] === "") {
      setActiveIndex(activeIndex - 1);
      const next = [...digits];
      next[activeIndex - 1] = "";
      setDigits(next);
    } else if (digits[activeIndex] !== "") {
      const next = [...digits];
      next[activeIndex] = "";
      setDigits(next);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === "Backspace") handleDelete();
      else if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in-up">
      <button
        onClick={onCancel}
        className="absolute top-6 left-6 text-white/40 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-cyan/20 border-2 border-cyan/40 flex items-center justify-center text-5xl shadow-lg shadow-cyan/10">
          {profileEmoji}
        </div>
        <h2 className="text-xl font-semibold text-white">{profileName}</h2>
        <p className="text-white/40 text-sm">Enter PIN</p>
      </div>

      <div className="flex gap-4">
        {digits.map((d, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
              i === activeIndex
                ? "bg-white/15 border-2 border-cyan shadow-lg shadow-cyan/20"
                : d
                  ? "bg-white/10 border-2 border-white/20"
                  : "bg-white/5 border-2 border-white/10"
            }`}
          >
            {d ? "•" : ""}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm animate-fade-in-up">{error}</p>
      )}

      {loading && (
        <p className="text-white/40 text-sm">Verifying...</p>
      )}

      <div className="grid grid-cols-3 gap-3 w-64">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
          (key, i) => (
            <button
              key={i}
              onClick={() => {
                if (key === "⌫") handleDelete();
                else if (key) handleDigit(key);
              }}
              disabled={!key || loading}
              className={`h-14 rounded-2xl text-xl font-semibold transition-all active:scale-95 ${
                key
                  ? "bg-white/8 text-white hover:bg-white/12 active:bg-white/15"
                  : "bg-transparent cursor-default"
              }`}
            >
              {key}
            </button>
          )
        )}
      </div>
    </div>
  );
}
