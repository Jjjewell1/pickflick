"use client";

import { useRef, useState, useCallback } from "react";

interface GenreWheelProps {
  genres: string[];
  onGenreSelected: (genre: string) => void;
  canReroll: boolean;
  onReroll: () => void;
}

export default function GenreWheel({
  genres,
  onGenreSelected,
  canReroll,
  onReroll,
}: GenreWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (spinning || genres.length === 0) return;
    setSpinning(true);
    setResult(null);

    const segmentAngle = 360 / genres.length;
    const randomIndex = Math.floor(Math.random() * genres.length);
    const targetAngle =
      360 * 5 + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult(genres[randomIndex]);
      onGenreSelected(genres[randomIndex]);
    }, 3200);
  }, [spinning, genres, onGenreSelected]);

  const segmentAngle = 360 / Math.max(genres.length, 1);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-3xl"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
        >
          ▼
        </div>

        <div
          ref={wheelRef}
          className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-theater-gold/50 overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {genres.map((genre, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = (i + 1) * segmentAngle;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;

              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);

              const largeArc = segmentAngle > 180 ? 1 : 0;

              const colors = [
                "#C41E3A",
                "#9B1830",
                "#8B1528",
                "#A01C32",
                "#B81D36",
                "#D42040",
                "#E82548",
                "#C41E3A",
                "#9B1830",
                "#8B1528",
              ];

              const textAngle = startAngle + segmentAngle / 2;
              const textRad = ((textAngle - 90) * Math.PI) / 180;
              const textX = 100 + 62 * Math.cos(textRad);
              const textY = 100 + 62 * Math.sin(textRad);
              const textRotation = textAngle;

              return (
                <g key={genre}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={colors[i % colors.length]}
                    stroke="#1A0A0A"
                    strokeWidth="1"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {genre.length > 10 ? genre.slice(0, 9) + "…" : genre}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {!result && (
        <button onClick={spin} disabled={spinning} className="btn-primary">
          {spinning ? "Spinning..." : "Spin the Wheel!"}
        </button>
      )}

      {result && (
        <div className="text-center animate-fade-in-up">
          <p className="text-white/60 text-sm mb-2">Tonight&apos;s genre:</p>
          <p className="text-3xl font-display font-bold text-theater-gold text-glow-gold">
            {result}
          </p>
          {canReroll && (
            <button
              onClick={() => {
                onReroll();
                setResult(null);
              }}
              className="btn-secondary mt-4 text-sm"
            >
              🎲 Reroll Genre
            </button>
          )}
        </div>
      )}
    </div>
  );
}
