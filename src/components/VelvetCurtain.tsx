"use client";

export default function VelvetCurtain() {
  const scallops = Array.from({ length: 20 });
  return (
    <div className="pointer-events-none fixed top-0 inset-x-0 z-20">
      {/* Curtain band */}
      <div className="relative h-16 sm:h-20 bg-gradient-to-b from-[#5c0a18] via-[#8B1528] to-[#A01C32] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Pleat highlights */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 26px)",
          }}
        />
        {/* Sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
      </div>

      {/* Scalloped fringe */}
      <div className="flex justify-center -mt-px">
        {scallops.map((_, i) => (
          <div
            key={i}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-b-full bg-gradient-to-b from-[#A01C32] to-[#5c0a18] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.35)]"
            style={{ margin: "0 -2px" }}
          />
        ))}
      </div>
    </div>
  );
}
