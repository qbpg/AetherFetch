"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Copy, Check, Wifi, WifiOff, User, RefreshCw } from "lucide-react";
import { SessionProvider, useSession } from "@/contexts/SessionContext";

function Header() {
  const { session, sseConnected, doFetch, addToast } = useSession();
  const pathname = usePathname();
  const [copiedEmail, setCopiedEmail] = useState(false);

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
    <header className="relative h-12 border-b border-zinc-800 flex items-center justify-between px-2 sm:px-4 flex-shrink-0 z-[60]">
      <div className="flex items-center gap-2.5">
        <Link href={session ? "/dashboard" : "/home"} className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Mailbox" className="h-6 w-6 object-contain" />
          <span className="text-sm font-semibold tracking-tight hidden sm:block">Mailbox</span>
        </Link>
        {session && (
          <nav className="hidden sm:flex items-center gap-0.5 ml-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
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
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 bg-zinc-900 border border-zinc-800 rounded-md">
            <User className="w-3 h-3 text-zinc-500" />
            <span className="text-[11px] font-mono text-zinc-400 max-w-[160px] truncate">{session.email}</span>
            <button onClick={copyEmail} aria-label="Copy email"
              className="text-zinc-500 hover:text-zinc-300 transition-colors">
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <button onClick={copyEmail} aria-label="Copy email"
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <div className="hidden sm:flex items-center gap-1 h-7 px-2 bg-zinc-900 border border-zinc-800 rounded-md"
            title={sseConnected ? "Live via Mercure" : "Polling every 30s"}>
            {sseConnected ? (
              <><Wifi className="w-3 h-3 text-emerald-400" /><span className="text-[9px] text-emerald-400 hidden lg:block">Live</span></>
            ) : (
              <><WifiOff className="w-3 h-3 text-zinc-600" /><span className="text-[9px] text-zinc-600 hidden lg:block">Poll</span></>
            )}
          </div>

          <button onClick={() => { doFetch(session.token, { manual: true }); addToast("Refreshing...", "info"); }}
            aria-label="Refresh messages"
            className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      <div className="absolute top-14 left-0 right-0 z-[90] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 flex flex-col gap-2 pointer-events-auto px-4 pt-2">
          <ToastContainer />
        </div>
      </div>
      <Header />
      {children}
    </div>
  );
}

function ToastContainer() {
  const { toasts } = useSession();
  return (
    <>
      {toasts.map((t) => (
        <div key={t.id}
          className={`self-end px-3 py-2 rounded-lg text-xs font-medium shadow-lg border animate-toast-in pointer-events-auto transition-colors ${
            t.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
            t.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
            "bg-zinc-800/80 border-zinc-700/50 text-zinc-300"
          }`}>
          {t.message}
        </div>
      ))}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Mailbox - Temporary Email</title>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="h-full antialiased" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
        <SessionProvider>
          <AppShell>
            {children}
          </AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
