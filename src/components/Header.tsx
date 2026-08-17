"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl">🎬</span>
        <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-theater-gold transition-colors">
          Pick<span className="text-theater-red">Flick</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            pathname === "/"
              ? "bg-theater-red/20 text-theater-red"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Home
        </Link>
        <Link
          href="/history"
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            pathname === "/history"
              ? "bg-theater-red/20 text-theater-red"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          History
        </Link>
        <Link
          href="/settings"
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            pathname === "/settings"
              ? "bg-theater-red/20 text-theater-red"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Settings
        </Link>
      </nav>
    </header>
  );
}
