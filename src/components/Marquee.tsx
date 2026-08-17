"use client";

function BulbRow({ count, reverse }: { count: number; reverse?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1 px-2">
      {Array.from({ length: count }).map((_, i) => {
        const delay = reverse ? (count - i) * 0.09 : i * 0.09;
        return (
          <span
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-theater-gold"
            style={{ animation: `bulbBlink 1.2s ease-in-out ${delay}s infinite` }}
          />
        );
      })}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative select-none">
      {/* Spotlight beams behind the marquee */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-24 left-[10%] w-40 h-[140%] bg-gradient-to-b from-theater-gold/20 to-transparent blur-2xl"
          style={{ animation: "spotlightSway 9s ease-in-out infinite" }}
        />
        <div
          className="absolute -top-24 right-[10%] w-40 h-[140%] bg-gradient-to-b from-theater-red/20 to-transparent blur-2xl"
          style={{ animation: "spotlightSway 9s ease-in-out 1.5s infinite" }}
        />
      </div>

      {/* Marquee frame */}
      <div className="relative rounded-2xl sm:rounded-3xl border-4 border-theater-gold/60 bg-gradient-to-b from-[#2a0a12] via-[#1a0608] to-[#120406] shadow-[0_0_40px_rgba(245,197,24,0.15),0_20px_60px_rgba(0,0,0,0.6)] px-6 sm:px-12 py-5 sm:py-7">
        <BulbRow count={26} />
        <div className="my-2 sm:my-3 text-center">
          <p className="text-theater-gold/70 text-[10px] sm:text-xs uppercase tracking-[0.4em] font-semibold mb-1">
            ✦ Now Showing ✦
          </p>
          <h1 className="font-display font-black leading-none tracking-tight">
            <span className="text-4xl sm:text-6xl bg-gradient-to-b from-yellow-100 via-theater-gold to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,197,24,0.35)]">
              Pick<span className="text-theater-red">Flick</span>
            </span>
          </h1>
          <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] mt-1">
            Movie night, decided together
          </p>
        </div>
        <BulbRow count={26} reverse />
      </div>
    </div>
  );
}
