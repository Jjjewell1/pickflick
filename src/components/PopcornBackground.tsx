"use client";

export default function TechBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base obsidian */}
      <div className="absolute inset-0 bg-[#0A0A0F]" />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Drifting ambient glows */}
      <div
        className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(0,229,255,0.10) 0%, transparent 70%)",
          animation: "glowDrift 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)",
          animation: "glowDrift 24s ease-in-out 8s infinite",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(0,131,143,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const size = 4 + (i % 3) * 3;
        const isCircle = i % 2 === 0;
        return (
          <div
            key={`shape-${i}`}
            className="absolute opacity-[0.08]"
            style={{
              left: `${(i * 13 + 5) % 95}%`,
              top: `${(i * 17 + 8) % 90}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: isCircle ? "50%" : "1px",
              border: "1px solid rgba(0,229,255,0.5)",
              transform: `rotate(${i * 45}deg)`,
              animation: `floatKernel ${8 + (i % 3) * 3}s ease-in-out ${i * 0.8}s infinite`,
            }}
          />
        );
      })}

      {/* Tiny dot particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${(i * 9 + 3) % 97}%`,
            top: `${(i * 11 + 7) % 93}%`,
            width: "2px",
            height: "2px",
            background: "rgba(0,229,255,0.2)",
            animation: `floatKernel ${6 + (i % 3) * 2}s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(10,10,15,0.6) 100%)",
        }}
      />
    </div>
  );
}
