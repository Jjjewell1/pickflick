"use client";

export default function Marquee() {
  return (
    <div
      className="relative select-none w-full max-w-xl mx-auto"
      style={{ animation: "heroRise 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Radial glow behind logo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] bg-theater-magenta/12 blur-[80px] rounded-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[180px] h-[180px] bg-theater-gold/8 blur-[60px] rounded-full" />
      </div>

      {/* Logo — large, centered, no frame */}
      <div className="relative flex flex-col items-center justify-center py-6 sm:py-8 px-4">
        <img
          src="/logo.png"
          alt="PickFlick"
          className="relative h-28 sm:h-40 md:h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(192,48,120,0.45)]"
          style={{ animation: "logoGlowPulse 4s ease-in-out infinite" }}
        />
      </div>

      {/* Tagline */}
      <p
        className="text-center mt-3 text-[10px] sm:text-xs uppercase tracking-[0.5em] text-theater-gold/60 font-bold"
        style={{ animation: "heroRise 0.7s ease-out 0.3s both" }}
      >
        ✦ Your Movie Night, Solved ✦
      </p>
    </div>
  );
}
