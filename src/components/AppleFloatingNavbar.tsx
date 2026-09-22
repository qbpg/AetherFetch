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
      <div className="flex justify-center pt-3 sm:pt-4">
        <nav
          className="pointer-events-auto mx-auto flex h-13 sm:h-14 w-[94vw] max-w-3xl items-center justify-between rounded-2xl bg-zinc-900 border border-zinc-800 px-5 sm:px-7"
        >
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <img
              src="/logo.svg"
              alt="AetherFetch"
              className="h-8 w-8 object-contain"
            />
            <span className="font-semibold tracking-tight text-zinc-100 text-base hidden sm:inline">
              AetherFetch
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 rounded-lg transition-colors whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 text-[13px] font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-[13px] font-medium text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap"
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
