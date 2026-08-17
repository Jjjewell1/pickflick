"use client";

export default function PopcornBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0510] via-[#0D0508] to-[#0A0305]" />

      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-lg opacity-20 select-none"
          style={{
            left: `${(i * 8.3) % 100}%`,
            top: `${(i * 17 + 5) % 100}%`,
            animation: `floatKernel ${6 + (i % 3) * 2}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          🍿
        </div>
      ))}

      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-theater-red/5 blur-[120px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-theater-gold/5 blur-[120px]" />
    </div>
  );
}
