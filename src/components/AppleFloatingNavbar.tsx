"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function AppleFloatingNavbar() {
  const { session } = useSession();

  const scrollTo = useCallback((href: string) => {
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="flex justify-center pt-2.5 sm:pt-3">
        <nav
          className="pointer-events-auto mx-auto flex h-11 w-[92vw] max-w-3xl items-center justify-between rounded-full bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/60 shadow-[0_2px_24px_rgba(0,0,0,0.4)] px-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/80 hover:shadow-[0_2px_32px_rgba(0,0,0,0.5)]"
        >
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <img
              src="/logo.svg"
              alt="AetherFetch"
              className="h-6 w-6 object-contain"
            />
            <span className="font-semibold tracking-tight text-zinc-100 text-sm hidden sm:inline">
              AetherFetch
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-full transition-all duration-200 whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center">
            {session ? (
              <Link
                href="/dashboard"
                className="px-3.5 py-1 text-xs font-medium text-zinc-100 bg-indigo-500 hover:bg-indigo-400 rounded-full transition-all duration-200 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] active:scale-95 whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1 text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Get Started
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
