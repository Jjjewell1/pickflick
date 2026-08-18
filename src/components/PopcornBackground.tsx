"use client";

export default function PopcornBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#14163A] via-[#0B0D1E] to-[#1A0F2E]" />

      {/* Floating popcorn kernels */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={`kernel-${i}`}
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

      {/* Popping corn particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`pop-${i}`}
          className="absolute select-none"
          style={{
            left: `${10 + i * 11}%`,
            bottom: "5%",
            fontSize: `${10 + (i % 3) * 4}px`,
            opacity: 0.25 + (i % 4) * 0.05,
            animation: `popCorn ${3 + (i % 3) * 1.5}s ease-out ${i * 0.7}s infinite`,
          }}
        >
          🌽
        </div>
      ))}

      {/* Popping burst particles — kernels mid-air */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`burst-${i}`}
          className="absolute select-none"
          style={{
            left: `${20 + i * 12}%`,
            bottom: "12%",
            fontSize: "8px",
            opacity: 0,
            animation: `popBurst ${2.5 + (i % 2)}s ease-out ${i * 0.9 + 0.3}s infinite`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Popcorn bucket — bottom right */}
      <div className="absolute bottom-[-10px] right-[-15px] sm:right-[5%] opacity-[0.08] select-none pointer-events-none">
        <div
          className="text-[100px] sm:text-[140px] leading-none"
          style={{
            filter: "drop-shadow(0 0 30px rgba(192,48,120,0.3))",
          }}
        >
          🪣
        </div>
        {/* Popcorn pieces bursting out of the bucket */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`bucket-pop-${i}`}
            className="absolute text-[18px] sm:text-[24px]"
            style={{
              right: `${10 + i * 15}%`,
              top: `${-20 - i * 12}px`,
              animation: `bucketPop ${2 + i * 0.4}s ease-out ${i * 0.5}s infinite`,
              opacity: 0.6,
            }}
          >
            🍿
          </div>
        ))}
      </div>

      {/* Ambient glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-theater-magenta/15 blur-[130px]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-theater-orange/15 blur-[130px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-theater-indigo/10 blur-[140px]" />
    </div>
  );
}
