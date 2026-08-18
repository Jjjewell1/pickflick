"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onHowTo?: () => void;
}

export default function Header({ onHowTo }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
      <Link href="/" className="flex items-center group">
        <img
          src="/logo.png"
          alt="PickFlick"
          className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(192,48,120,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(192,48,120,0.5)] transition-all"
        />
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        {onHowTo && (
          <button
            onClick={onHowTo}
            className="px-3 py-1.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            How To
          </button>
        )}
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
