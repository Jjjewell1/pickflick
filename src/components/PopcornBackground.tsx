"use client";

export default function PopcornBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#060810]" />

      {/* Soft top wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(72,48,120,0.25) 0%, transparent 60%)",
        }}
      />

      {/* Drifting ambient glows */}
      <div
        className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-theater-magenta/10 blur-[120px]"
        style={{ animation: "glowDrift 20s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-theater-orange/8 blur-[120px]"
        style={{ animation: "glowDrift 24s ease-in-out 8s infinite" }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Sparse floating kernels */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`kernel-${i}`}
          className="absolute text-base opacity-10 select-none"
          style={{
            left: `${(i * 17 + 8) % 90}%`,
            top: `${(i * 23 + 12) % 85}%`,
            animation: `floatKernel ${8 + (i % 3) * 2}s ease-in-out ${i * 0.7}s infinite`,
          }}
        >
          🍿
        </div>
      ))}
    </div>
  );
}
