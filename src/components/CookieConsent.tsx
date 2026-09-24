"use client";

import { useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "af_cookie_consent";

type ConsentValue = "accepted" | "rejected" | null;

function getStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  let v: string | null;
  try { v = localStorage.getItem(STORAGE_KEY); } catch { return null; }
  if (v === "accepted" || v === "rejected") return v;
  return null;
}

export default function CookieConsent() {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [dismissed, setDismissed] = useState(false);

  function decide(value: "accepted" | "rejected") {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* storage unavailable */ }
    setDismissed(true);
  }

  if (!hydrated || dismissed || getStoredConsent() !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] pointer-events-none">
      <div className="mx-auto max-w-2xl px-4 pb-4 pointer-events-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 text-xs text-zinc-400 leading-relaxed">
            <span className="text-zinc-300 font-medium">Cookie Notice.</span>{" "}
            We use local storage to remember your session and preferences.
            No third-party tracking cookies are set. By continuing to use this site you agree to our{" "}
            <Link href="/privacy"
              className="text-zinc-300 hover:text-zinc-50 underline-offset-2 underline transition-colors">
              Privacy Policy
            </Link>.
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => decide("rejected")}
              className="h-7 px-3 text-xs font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
              Reject
            </button>
            <button onClick={() => decide("accepted")}
              className="h-7 px-3 text-xs font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-md transition-colors">
              Accept
            </button>
            <button onClick={() => setDismissed(true)} aria-label="Dismiss"
              className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
