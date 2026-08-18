"use client";

const BULB_COLORS = ["#483078", "#C03078", "#F04848", "#F06048"];

function BulbRow({ count, reverse }: { count: number; reverse?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1 px-2">
      {Array.from({ length: count }).map((_, i) => {
        const delay = reverse ? (count - i) * 0.09 : i * 0.09;
        return (
          <span
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
            style={{
              background: BULB_COLORS[i % BULB_COLORS.length],
              animation: `bulbBlink 1.2s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative select-none w-full">
      {/* Spotlight beams behind the marquee */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-24 left-[10%] w-40 h-[140%] bg-gradient-to-b from-theater-magenta/25 to-transparent blur-2xl"
          style={{ animation: "spotlightSway 9s ease-in-out infinite" }}
        />
        <div
          className="absolute -top-24 right-[10%] w-40 h-[140%] bg-gradient-to-b from-theater-orange/25 to-transparent blur-2xl"
          style={{ animation: "spotlightSway 9s ease-in-out 1.5s infinite" }}
        />
      </div>

      {/* Marquee frame */}
      <div className="relative rounded-2xl sm:rounded-3xl border-2 border-white/10 bg-gradient-to-b from-[#1A1C3A] via-[#0F1130] to-[#150E28] shadow-[0_0_50px_rgba(192,48,120,0.15),0_20px_60px_rgba(0,0,0,0.6)] px-5 sm:px-10 py-5 sm:py-7">
        <BulbRow count={26} />

        <div className="my-3 sm:my-4 flex justify-center">
          <img
            src="/logo.png"
            alt="PickFlick — Your Movie Night, Solved"
            className="h-28 sm:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(192,48,120,0.4)]"
          />
        </div>

        <BulbRow count={26} reverse />
      </div>
    </div>
  );
}
