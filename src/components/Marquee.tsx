"use client";

const BULB_COLORS = ["#F5C518", "#F06048", "#C03078", "#483078", "#F04848"];

function Bulb({ color, delay }: { color: string; delay: number }) {
  return (
    <span
      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
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
    <div className="flex items-center justify-between gap-1.5 px-2">
      {Array.from({ length: count }).map((_, i) => (
        <Bulb
          key={i}
          color={BULB_COLORS[i % BULB_COLORS.length]}
          delay={reverse ? (count - i) * 0.12 : i * 0.12}
        />
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="relative select-none w-full max-w-lg mx-auto"
      style={{ animation: "heroRise 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Outer glow halo */}
      <div className="pointer-events-none absolute -inset-8 bg-theater-magenta/10 blur-[80px] rounded-full" />
      <div className="pointer-events-none absolute -inset-4 bg-theater-gold/5 blur-[50px] rounded-full" />

      {/* Marquee frame */}
      <div className="relative rounded-2xl sm:rounded-3xl border-2 border-theater-gold/20 bg-gradient-to-b from-[#1B1D40]/80 via-[#0F1130]/90 to-[#160F2A]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(192,48,120,0.15),0_0_160px_rgba(72,48,120,0.08),0_30px_80px_rgba(0,0,0,0.7)] p-2 sm:p-2.5">
        <BulbRow count={16} />

        {/* Logo — big and bold */}
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
          {/* Glow behind logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 sm:w-56 sm:h-56 bg-theater-magenta/15 blur-[60px] rounded-full" />
          </div>

          <img
            src="/logo.png"
            alt="PickFlick"
            className="relative h-32 sm:h-44 md:h-52 w-auto object-contain drop-shadow-[0_0_30px_rgba(192,48,120,0.4)]"
            style={{ animation: "logoGlowPulse 4s ease-in-out infinite" }}
          />
        </div>

        <BulbRow count={16} reverse />
      </div>

      {/* Tagline — outside the box, cleaner */}
      <p
        className="text-center mt-5 text-[10px] sm:text-xs uppercase tracking-[0.5em] text-theater-gold/60 font-bold"
        style={{ animation: "heroRise 0.7s ease-out 0.3s both" }}
      >
        ✦ Your Movie Night, Solved ✦
      </p>
    </div>
  );
}
