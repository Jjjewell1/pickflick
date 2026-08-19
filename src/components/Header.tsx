"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onHowTo?: () => void;
}

export default function Header({ onHowTo }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="relative z-30 mx-4 sm:mx-6 mt-6 sm:mt-8">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo — text-based */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <span
            className="font-display text-xl sm:text-2xl font-black tracking-[0.08em] text-white/80 group-hover:text-theater-gold transition-colors duration-300"
            style={{
              textShadow: "0 0 20px rgba(245,197,24,0.2)",
            }}
          >
            PICK
            <span className="text-theater-gold">FLICK</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {onHowTo && (
            <button
              onClick={onHowTo}
              className="relative px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              How To
            </button>
          )}
          <NavLink href="/" label="Home" active={pathname === "/"} />
          <NavLink href="/history" label="History" active={pathname === "/history"} />
          <NavLink href="/settings" label="Settings" active={pathname === "/settings"} />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "text-theater-gold bg-theater-gold/10"
          : "text-white/40 hover:text-white hover:bg-white/[0.06]"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-theater-gold shadow-[0_0_6px_rgba(245,197,24,0.6)]" />
      )}
    </Link>
  );
}
