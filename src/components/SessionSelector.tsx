"use client";

import { useState, useCallback } from "react";
import { ArrowRight, Plus, Mail } from "lucide-react";
import { clearSession, getSession } from "@/lib/mailbox";
import type { SessionData } from "@/lib/types";

interface SessionSelectorProps {
  onContinue: () => void;
  onNewMailbox: () => void;
}

function truncateEmail(email: string, maxLen = 28): string {
  if (email.length <= maxLen) return email;
  const [user, domain] = email.split("@");
  if (user.length > 10) {
    return `${user.slice(0, 8)}...@${domain}`;
  }
  return email;
}

function getStoredSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    return getSession();
  } catch {
    return null;
  }
}

export default function SessionSelector({ onContinue, onNewMailbox }: SessionSelectorProps) {
  const [storedSession] = useState<SessionData | null>(() => getStoredSession());
  const [pressed, setPressed] = useState<"continue" | "new" | null>(null);
  const [exiting, setExiting] = useState(false);

  const handleChoice = useCallback((choice: "continue" | "new") => {
    setPressed(choice);
    setExiting(true);
    setTimeout(() => {
      if (choice === "continue") {
        onContinue();
      } else {
        clearSession();
        onNewMailbox();
      }
    }, 280);
  }, [onContinue, onNewMailbox]);

  if (!storedSession) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className={`w-full max-w-lg transition-all duration-300 ${exiting ? "opacity-0 scale-[0.97] translate-y-1" : "opacity-100 scale-100 translate-y-0"}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 mb-4">
            <img src="/logo.svg" alt="AetherFetch" className="w-11 h-11 object-contain" />
          </div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Welcome back</h1>
          <p className="text-xs text-zinc-500 mt-1.5">You have an existing session. What would you like to do?</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleChoice("continue")}
            disabled={pressed !== null}
            className="group w-full text-left p-4 bg-zinc-900 border border-zinc-800 rounded-xl transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-60"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/20 transition-colors duration-200">
                  <Mail className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors duration-200" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100 truncate">{truncateEmail(storedSession.email)}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                      <span className="text-[9px] font-medium text-emerald-400 uppercase tracking-wider">Active</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Continue where you left off</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-200">
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors duration-200" />
              </div>
            </div>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-950 px-2 text-[10px] text-zinc-600 uppercase tracking-widest">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleChoice("new")}
            disabled={pressed !== null}
            className="group w-full text-left p-4 bg-zinc-900 border border-zinc-800 rounded-xl transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-60"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/20 transition-colors duration-200">
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors duration-200" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-medium text-zinc-100">New account</span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Generate a fresh temporary address</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800/50 border border-zinc-800 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-200">
                <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors duration-200" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
