"use client";

export default function Marquee() {
  return (
    <div
      className="relative select-none w-full max-w-2xl mx-auto"
      style={{ animation: "heroRise 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Radial glow behind logo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] bg-theater-magenta/15 blur-[100px] rounded-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[250px] h-[250px] bg-theater-gold/10 blur-[80px] rounded-full" />
      </div>

      {/* Logo — large, centered, no frame */}
      <div className="relative flex flex-col items-center justify-center py-10 sm:py-14 px-4">
        <img
          src="/logo.png"
          alt="PickFlick"
          className="relative h-48 sm:h-64 md:h-80 w-auto object-contain drop-shadow-[0_0_40px_rgba(192,48,120,0.5)]"
          style={{ animation: "logoGlowPulse 4s ease-in-out infinite" }}
        />
      </div>

      {/* Tagline */}
      <p
        className="text-center mt-4 text-[10px] sm:text-xs uppercase tracking-[0.5em] text-theater-gold/60 font-bold"
        style={{ animation: "heroRise 0.7s ease-out 0.3s both" }}
      >
        ✦ Your Movie Night, Solved ✦
      </p>
    </div>
  );
}
