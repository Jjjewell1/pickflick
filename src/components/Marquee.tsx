"use client";

export default function Marquee() {
  return (
    <div
      className="relative select-none w-full max-w-lg mx-auto"
      style={{ animation: "heroRise 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Outer glow halo — cyan */}
      <div className="pointer-events-none absolute -inset-8 blur-[80px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute -inset-4 blur-[50px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,188,212,0.06) 0%, transparent 70%)" }} />

      {/* Marquee frame — glass panel with cyan edge */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] p-6 sm:p-8">
        {/* Cyan accent line at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

        {/* Logo — big and bold */}
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-4">
          {/* Glow behind logo — subtle cyan */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 sm:w-56 sm:h-56 blur-[60px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 70%)" }} />
          </div>

          <img
            src="/logo.png"
            alt="PickFlick"
            className="relative h-28 sm:h-40 md:h-48 w-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 20px rgba(0,229,255,0.3)) drop-shadow(0 0 60px rgba(0,229,255,0.1))",
              animation: "logoGlowPulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Cyan accent line at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>

      {/* Tagline — outside the box */}
      <p
        className="text-center mt-5 text-[10px] sm:text-xs uppercase tracking-[0.5em] font-bold text-silver/40"
        style={{ animation: "heroRise 0.7s ease-out 0.3s both" }}
      >
        ✦ Your Movie Night, Solved ✦
      </p>
    </div>
  );
}
