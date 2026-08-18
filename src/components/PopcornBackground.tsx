"use client";

export default function PopcornBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#14163A] via-[#0B0D1E] to-[#1A0F2E]" />

      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-lg opacity-15 select-none"
          style={{
            left: `${(i * 8.3) % 100}%`,
            top: `${(i * 17 + 5) % 100}%`,
            animation: `floatKernel ${6 + (i % 3) * 2}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          🍿
        </div>
      ))}

      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-theater-magenta/15 blur-[130px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-theater-orange/15 blur-[130px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-theater-indigo/10 blur-[140px]" />
    </div>
  );
}
