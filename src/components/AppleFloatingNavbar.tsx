"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function AppleFloatingNavbar() {
  const { session } = useSession();
  const [open, setOpen] = useState(false);

  const scrollTo = useCallback((href: string) => {
    setOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-[100] pointer-events-none">
      {open && (
        <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}
          className="pointer-events-auto fixed inset-0 bg-black/50 md:hidden" />
      )}
      <div className="relative mx-auto w-[94vw] max-w-3xl pt-3 sm:pt-4">
        <nav className="pointer-events-auto flex h-13 items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-4 shadow-lg shadow-black/20 sm:h-14 sm:px-7">
          <Link href="/" onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo.svg" alt="AetherFetch" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">AetherFetch</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button key={link.href} type="button" onClick={() => scrollTo(link.href)}
                className="rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50">
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden shrink-0 md:flex">
            <Link href={session ? "/dashboard" : "/login"}
              className={session
                ? "rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 text-[13px] font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
                : "rounded-lg bg-white px-5 py-2 text-[13px] font-medium text-zinc-950 transition-colors hover:bg-zinc-200"}>
              {session ? "Dashboard" : "Get Started"}
            </Link>
          </div>

          <button type="button" aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open} aria-controls="mobile-site-menu"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-200 transition-colors hover:bg-zinc-800 md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div id="mobile-site-menu" aria-hidden={!open}
          className={`pointer-events-auto absolute inset-x-0 top-full mt-2 grid overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/30 transition-[grid-template-rows,opacity,transform] duration-200 ease-out md:hidden ${open ? "grid-rows-[1fr] translate-y-0 opacity-100" : "pointer-events-none grid-rows-[0fr] -translate-y-2 opacity-0"}`}>
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-1 p-2">
              {NAV_LINKS.map((link) => (
                <button key={link.href} type="button" tabIndex={open ? 0 : -1}
                  onClick={() => scrollTo(link.href)}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
                  {link.label}
                </button>
              ))}
              <div className="my-1 border-t border-zinc-800" />
              <Link href="/docs" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">
                User Guide
              </Link>
              <Link href={session ? "/dashboard" : "/login"} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}
                className="mx-2 my-2 rounded-lg bg-zinc-100 px-4 py-3 text-center text-sm font-semibold text-zinc-950">
                {session ? "Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
