"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function AppleFloatingNavbar() {
  const { session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["features", "faq", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const navWidth = isMobile
    ? "w-[94vw] max-w-sm"
    : scrolled
      ? "w-[92vw] max-w-6xl"
      : "w-auto max-w-xl";

  const navRadius = isMobile
    ? "rounded-full"
    : scrolled
      ? "rounded-2xl"
      : "rounded-full";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="flex justify-center pt-2.5 sm:pt-3">
        <nav
          className={`pointer-events-auto mx-2 flex h-11 items-center justify-between ${navWidth} ${navRadius} transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? "bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 shadow-[0_2px_24px_rgba(0,0,0,0.5)] px-4 sm:px-6"
              : "bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 px-4 sm:px-5"
          }`}
        >
          <Link href="/" className={`flex shrink-0 items-center gap-2 transition-all duration-500 ${scrolled ? "mr-1" : "mr-2"}`}>
            <img
              src="/logo.svg"
              alt="AetherFetch"
              className={`object-contain transition-all duration-500 ${scrolled ? "h-5 w-5" : "h-6 w-6"}`}
            />
            <span className={`font-semibold tracking-tight text-zinc-100 transition-all duration-500 overflow-hidden ${
              scrolled ? "w-0 opacity-0 text-xs" : "w-auto opacity-100 text-sm"
            }`}>
              AetherFetch
            </span>
          </Link>

          <div className={`flex items-center justify-center transition-all duration-500 overflow-hidden ${
            scrolled ? "gap-1" : "gap-1.5"
          }`}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`relative px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeSection === link.href.replace("#", "")
                    ? "text-zinc-100 bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.06)] border border-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 hover:shadow-[0_0_16px_rgba(255,255,255,0.04)] hover:border-zinc-700/80"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {session ? (
              <Link
                href="/dashboard"
                className="px-3 py-1 text-xs font-medium text-zinc-100 bg-indigo-500 hover:bg-indigo-400 rounded-full transition-all duration-200 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] active:scale-95 whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1 text-xs font-medium text-zinc-300 hover:text-zinc-100 rounded-full transition-all duration-200 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(255,255,255,0.04)] hover:border-zinc-700/80 whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1 text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 rounded-full transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
