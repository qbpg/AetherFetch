"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ChevronDown,
  AlertCircle, Shuffle, Copy, Check, User, Tag, Trash2,
} from "lucide-react";
import Footer from "@/components/Footer";
import {
  getDomains, createAccount, getToken, getMe,
  saveSession, saveAccountToHistory, generateValidPassword,
  getSavedAccounts, removeSavedAccount,
} from "@/lib/mailbox";
import type { Domain, SavedAccount } from "@/lib/types";

interface AuthFormProps {
  onAuthenticated: () => void;
  initialMode?: "login" | "register";
}

const DEFAULT_DOMAIN = "uberip.com";
const MIN_SUBMIT_MS = 1500;

function getInitialMode(): "login" | "register" {
  if (typeof window === "undefined") return "register";
  try {
    const raw = localStorage.getItem("mailbox_saved_accounts");
    const accounts: SavedAccount[] = raw ? JSON.parse(raw) : [];
    return accounts.length > 0 ? "login" : "register";
  } catch {
    return "register";
  }
}

export default function AuthForm({ onAuthenticated, initialMode }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode ?? getInitialMode());
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [domainOpen, setDomainOpen] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [accountLabel, setAccountLabel] = useState("");
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("mailbox_saved_accounts");
      return raw ? (JSON.parse(raw) as SavedAccount[]) : [];
    } catch { return []; }
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formLoadTime = useRef<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    getDomains()
      .then((d) => {
        if (cancelled) return;
        setDomains(d);
        const active = d.find((domain) => domain.isActive);
        if (active) setSelectedDomain(active.domain);
        else if (d.length > 0) setSelectedDomain(d[0].domain);
      })
      .catch(() => {
        if (!cancelled) {
          setDomains([{ "@id": "/domains/1", "@type": "Domain", id: "1", domain: DEFAULT_DOMAIN, isActive: true, isPrivate: false, created: "" }]);
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDomainOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const refreshAccounts = useCallback(() => {
    setSavedAccounts(getSavedAccounts());
  }, []);

  const handleRemoveAccount = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    removeSavedAccount(address);
    setSavedAccounts(getSavedAccounts());
  };

  const generateRandomCredentials = () => {
    const randomUser = "user_" + Math.random().toString(36).substring(2, 10);
    setUsername(randomUser);
    setPassword(generateValidPassword());
  };

  const handleQuickLogin = async (acc: SavedAccount) => {
    setError("");
    setLoading(true);
    try {
      const tokenRes = await getToken(acc.address, acc.password);
      const meData = await getMe(tokenRes.token);
      saveSession({ token: tokenRes.token, email: acc.address, password: acc.password, accountId: meData.id });
      saveAccountToHistory(acc.address, acc.password, acc.label);
      onAuthenticated();
    } catch {
      setError("Failed to connect. Credentials may be invalid.");
    } finally {
      setLoading(false);
    }
  };

  const checkAntiBot = (): boolean => {
    if (honeypotRef.current?.value) return false;
    if (Date.now() - formLoadTime.current < MIN_SUBMIT_MS) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkAntiBot()) {
      setError("Verification failed. Please try again.");
      return;
    }

    if (mode === "register") {
      const trimmed = username.trim();
      if (!trimmed) { setError("Username is required."); return; }
      if (!selectedDomain) { setError("Please wait for domains to load."); return; }
      if (!password) { setError("Password is required."); return; }

      const fullAddress = `${trimmed}@${selectedDomain}`;
      setLoading(true);
      try {
        const account = await createAccount(fullAddress, password);
        const tokenRes = await getToken(fullAddress, password);
        saveSession({ token: tokenRes.token, email: fullAddress, password, accountId: account.id });
        saveAccountToHistory(fullAddress, password, accountLabel.trim() || undefined);
        onAuthenticated();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Registration failed.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    } else {
      const trimmed = username.trim();
      if (!trimmed) { setError("Identifiant requis."); return; }
      if (!selectedDomain) { setError("Please wait for domains to load."); return; }
      if (!password) { setError("Mot de passe requis."); return; }

      const fullAddress = `${trimmed}@${selectedDomain}`;
      setLoading(true);
      try {
        const tokenRes = await getToken(fullAddress, password);
        const meData = await getMe(tokenRes.token);
        saveSession({ token: tokenRes.token, email: fullAddress, password, accountId: meData.id });
        saveAccountToHistory(fullAddress, password, accountLabel.trim() || undefined);
        onAuthenticated();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAndCopy = async () => {
    const trimmed = username.trim();
    if (!trimmed) { setError("Username is required."); return; }
    if (!selectedDomain) { setError("Please wait for domains to load."); return; }
    if (!password) { setError("Password is required."); return; }

    if (!checkAntiBot()) {
      setError("Verification failed. Please try again.");
      return;
    }

    const fullAddress = `${trimmed}@${selectedDomain}`;
    setLoading(true);
    setError("");
    try {
      const account = await createAccount(fullAddress, password);
      const tokenRes = await getToken(fullAddress, password);
      saveSession({ token: tokenRes.token, email: fullAddress, password, accountId: account.id });
      saveAccountToHistory(fullAddress, password, accountLabel.trim() || undefined);
      try { await navigator.clipboard.writeText(fullAddress); } catch { /* noop */ }
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
      onAuthenticated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-start bg-[#09090b] px-4 py-8 sm:justify-center overflow-y-auto">
      <div className="w-full max-w-sm flex flex-col sm:justify-center mt-auto sm:mt-0 mb-auto sm:mb-0">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 transition-transform duration-300 hover:scale-105">
            <img src="/logo.svg" alt="Mailbox" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">Mailbox</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">Temporary email, instant access.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-2xl shadow-black/40">
          <div className="flex bg-[#09090b] rounded-lg p-0.5 mb-5 sm:mb-6">
            <button type="button" onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                mode === "register"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
              }`}>
              Register
            </button>
            <button type="button" onClick={() => { setMode("login"); setError(""); refreshAccounts(); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                mode === "login"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
              }`}>
              Login
            </button>
          </div>

          {mode === "login" && savedAccounts.length > 0 && (
            <div className="mb-4 space-y-1.5">
              <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider px-1">Quick connect</p>
              {savedAccounts.map((acc) => (
                <button key={acc.address} type="button" onClick={() => handleQuickLogin(acc)} disabled={loading}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-[#09090b] border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-150 group text-left disabled:opacity-50">
                  <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/30 transition-colors">
                    <User className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">{acc.address}</p>
                    <p className="text-[10px] text-zinc-600 font-mono truncate">{acc.password}</p>
                  </div>
                  <span onClick={(e) => handleRemoveAccount(e, acc.address)}
                    className="flex-shrink-0 p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove account">
                    <Trash2 className="w-3 h-3" />
                  </span>
                </button>
              ))}
              <div className="border-t border-zinc-800/60 my-3" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off"
              className="absolute opacity-0 pointer-events-none h-0 w-0 -z-10" aria-hidden="true" />

            {mode === "login" && savedAccounts.length > 0 && (
              <p className="text-[10px] text-zinc-600 text-center -mt-1">Or sign in with another account</p>
            )}

            {mode === "register" && (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="username" autoComplete="username"
                    className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-3 bg-[#09090b] border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button type="button" onClick={() => setDomainOpen(!domainOpen)}
                    className="h-10 sm:h-11 px-2.5 sm:px-3 pr-7 sm:pr-8 bg-[#09090b] border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 transition-all duration-200 whitespace-nowrap flex items-center gap-0.5 hover:border-zinc-700">
                    @{selectedDomain}
                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${domainOpen ? "rotate-180" : ""}`} />
                  </button>
                  {domainOpen && domains.length > 0 && (
                    <div className="absolute top-11 sm:top-12 right-0 z-50 w-48 sm:w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden max-h-44 overflow-y-auto animate-fade-in-up">
                      {domains.map((d) => (
                        <button key={d.id} type="button"
                          onClick={() => { setSelectedDomain(d.domain); setDomainOpen(false); }}
                          className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150 ${
                            d.domain === selectedDomain ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-300 hover:bg-zinc-800"
                          }`}>
                          {d.domain}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="relative flex items-center">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Identifiant / Pseudo" autoComplete="username"
                  className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-24 sm:pr-28 bg-[#09090b] border border-zinc-800 rounded-l-lg text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
                <span className="absolute right-0 top-0 h-10 sm:h-11 px-2.5 sm:px-3 flex items-center text-[11px] sm:text-xs text-zinc-500 bg-zinc-800/50 border border-l-0 border-zinc-800 rounded-r-lg select-none pointer-events-none whitespace-nowrap">
                  @{selectedDomain}
                </span>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 pointer-events-none" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" autoComplete={mode === "register" ? "new-password" : "current-password"}
                className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-9 sm:pr-10 bg-[#09090b] border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-150">
                {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>

            {mode === "register" && (
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 pointer-events-none" />
                <input type="text" value={accountLabel} onChange={(e) => setAccountLabel(e.target.value)}
                  placeholder='Label (ex: Netflix, Test Dev)'
                  className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-3 bg-[#09090b] border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
              </div>
            )}

            {mode === "register" && (
              <button type="button" onClick={generateRandomCredentials}
                className="w-full h-8 sm:h-9 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 hover:text-zinc-300 border border-zinc-800 rounded-lg transition-all duration-200 active:scale-[0.98]">
                <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Generate random credentials
              </button>
            )}

            {error && (
              <div className="flex items-start gap-2 text-xs sm:text-sm text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2 animate-in">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-10 sm:h-11 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98]">
              {loading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : (
                <>{mode === "register" ? "Create mailbox" : "Sign in"}<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>

            {mode === "register" && username.trim() && selectedDomain && (
              <button type="button" onClick={handleCreateAndCopy} disabled={loading}
                className="w-full h-8 sm:h-9 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium text-indigo-400/70 hover:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
                {loading ? <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" /> : (
                  copiedAddr ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
                {loading ? "Creating..." : copiedAddr ? "Created & copied!" : "Create & copy address"}
              </button>
            )}
          </form>

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-[11px] sm:text-xs text-zinc-600">
              {mode === "register" ? "Already have an account?" : "No account yet?"}{" "}
              <button type="button" onClick={() => router.push(mode === "register" ? "/login" : "/register")}
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-150 underline-offset-2 hover:underline">
                {mode === "register" ? "Sign in" : "Register"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-zinc-700 mt-4 sm:mt-6">
          Mailbox &mdash; Temporary email, instant access.
        </p>
      </div>
      <Footer />
    </div>
  );
}
