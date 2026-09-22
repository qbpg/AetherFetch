"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Copy, Check, Wifi, WifiOff, User, RefreshCw, Menu, X } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import AppleFloatingNavbar from "@/components/AppleFloatingNavbar";

function Header() {
  const { session, sseConnected, doFetch, addToast } = useSession();
  const pathname = usePathname();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyEmail = useCallback(async () => {
    if (!session) return;
    try { await navigator.clipboard.writeText(session.email); }
    catch {
      const i = document.createElement("input");
      i.value = session.email;
      document.body.appendChild(i);
      i.select();
      document.execCommand("copy");
      document.body.removeChild(i);
    }
    setCopiedEmail(true);
    addToast("Email copied", "success");
    setTimeout(() => setCopiedEmail(false), 2000);
  }, [session, addToast]);

  const navLinks = session ? [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/accounts", label: "Accounts" },
  ] : [];

  return (
    <header className="relative h-14 border-b border-zinc-800 flex items-center justify-between px-3 sm:px-5 flex-shrink-0 z-[60]">
      <div className="flex items-center gap-3">
        <Link href="/accounts" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="AetherFetch" className="h-7 w-7 object-contain" />
          <span className="text-base font-semibold tracking-tight hidden sm:block">AetherFetch</span>
          <span translate="no" className="text-[9px] font-bold text-zinc-500 bg-zinc-800 border border-zinc-700/50 px-1.5 py-0.5 rounded leading-none hidden sm:block">AF</span>
        </Link>
        {session && (
          <nav className="hidden sm:flex items-center gap-0.5 ml-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-zinc-100 bg-zinc-800"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {session && (
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5 h-8 px-3 bg-zinc-900 border border-zinc-800 rounded-md">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span translate="no" className="text-xs font-mono text-zinc-400 max-w-[180px] truncate">{session.email}</span>
            <button onClick={copyEmail} aria-label="Copy email"
              className="text-zinc-500 hover:text-zinc-300 transition-colors">
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button onClick={copyEmail} aria-label="Copy email"
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            {copiedEmail ? <Check className="w-4.5 h-4.5 text-emerald-400" /> : <Copy className="w-4.5 h-4.5" />}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 h-8 px-2.5 bg-zinc-900 border border-zinc-800 rounded-md"
            title={sseConnected ? "Live via Mercure" : "Polling every 30s"}>
            {sseConnected ? (
              <><Wifi className="w-3.5 h-3.5 text-emerald-400" /><span className="text-[10px] text-emerald-400 hidden lg:block">Live</span></>
            ) : (
              <><WifiOff className="w-3.5 h-3.5 text-zinc-600" /><span className="text-[10px] text-zinc-600 hidden lg:block">Poll</span></>
            )}
          </div>

          <button onClick={() => { doFetch(session.token, { manual: true }); addToast("Refreshing...", "info"); }}
            aria-label="Refresh messages"
            className="w-9 h-9 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      )}

      {session && mobileMenuOpen && (
        <div className="sm:hidden absolute top-14 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50 animate-fade-in-up">
          <div className="px-3 py-3 space-y-1">
            <div className="flex items-center gap-1.5 h-8 px-2 mb-2">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span translate="no" className="text-xs font-mono text-zinc-400 truncate">{session.email}</span>
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "text-zinc-100 bg-zinc-800"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

const LANDING_ROUTES = ["/", "/home"];

function ToastContainer() {
  const { toasts } = useSession();
  return (
    <>
      {toasts.map((t) => (
        <div key={t.id}
          className={`self-end px-3 py-2 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 animate-toast-in pointer-events-auto transition-colors ${
            t.type === "success" ? "text-emerald-400" :
            t.type === "error" ? "text-red-400" :
            "text-zinc-100"
          }`}>
          {t.message}
        </div>
      ))}
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = LANDING_ROUTES.includes(pathname);

  return (
    <div className={`${isLanding ? "min-h-[100dvh]" : "h-[100dvh]"} flex flex-col bg-[#09090b] text-zinc-100 ${isLanding ? "" : "overflow-hidden"}`}>
      <div className="absolute top-16 left-0 right-0 z-[90] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 flex flex-col gap-2 pointer-events-auto px-4 pt-2">
          <ToastContainer />
        </div>
      </div>
      {isLanding ? <AppleFloatingNavbar /> : <Header />}
      {children}
    </div>
  );
}
