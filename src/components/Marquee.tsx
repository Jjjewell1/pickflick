"use client";

const BULB_COLORS = ["#F5C518", "#F06048", "#C03078", "#483078", "#F04848"];

function Bulb({ color, delay }: { color: string; delay: number }) {
  return (
    <span
      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
      style={{
        background: color,
        color,
        animation: `bulbBlink 1.4s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function BulbRow({ count, reverse }: { count: number; reverse?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1 px-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <Bulb
          key={i}
          color={BULB_COLORS[i % BULB_COLORS.length]}
          delay={reverse ? (count - i) * 0.1 : i * 0.1}
        />
      ))}
    </div>
  );
}

function BulbColumn({ count, reverse }: { count: number; reverse?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-between gap-1 py-1.5 w-3 sm:w-4 flex-shrink-0">
      {Array.from({ length: count }).map((_, i) => (
        <Bulb
          key={i}
          color={BULB_COLORS[(i + 2) % BULB_COLORS.length]}
          delay={reverse ? (count - i) * 0.1 : i * 0.1}
        />
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="relative select-none w-full"
      style={{ animation: "heroRise 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Halo glow behind the frame */}
      <div className="pointer-events-none absolute -inset-6 bg-theater-magenta/10 blur-3xl rounded-[2.5rem]" />

      {/* Marquee frame */}
      <div className="relative rounded-2xl sm:rounded-3xl border-2 border-theater-gold/25 bg-gradient-to-b from-[#1B1D40] via-[#0F1130] to-[#160F2A] shadow-[0_0_60px_rgba(192,48,120,0.18),0_0_120px_rgba(72,48,120,0.12),0_25px_60px_rgba(0,0,0,0.65)] p-2 sm:p-3">
        <BulbRow count={20} />

        <div className="flex items-stretch mt-1.5 mb-1.5">
          <BulbColumn count={4} />

          <div className="flex-1 flex flex-col items-center justify-center px-2 py-5 sm:py-9">
            <img
              src="/logo.png"
              alt="PickFlick — Your Movie Night, Solved"
              className="h-24 sm:h-36 w-auto object-contain"
              style={{ animation: "logoGlowPulse 4s ease-in-out infinite" }}
            />
            <p className="mt-4 text-[9px] sm:text-[11px] uppercase tracking-[0.45em] text-theater-gold/80 font-bold">
              ✦ Your Movie Night, Solved ✦
            </p>
          </div>

          <BulbColumn count={4} reverse />
        </div>

        <BulbRow count={20} reverse />
      </div>
    </div>
  );
}
