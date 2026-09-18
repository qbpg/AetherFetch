"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Copy, Check, RefreshCw, LogOut, Mail, MailOpen, Trash2,
  Download, Loader2, Inbox, User, Wifi, WifiOff,
  UserPlus, Eye, EyeOff, X, Search, History,
  Star, StarOff, Archive, ArchiveRestore, ChevronLeft, Pencil,
} from "lucide-react";
import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";
import SecureMailIframe from "@/components/SecureMailIframe";
import {
  getSession, clearSession, getMessages, getMessage, deleteMessage,
  markAsRead, subscribeMercure, deleteAccount, getSavedAccounts,
  removeSavedAccount, saveSession, saveAccountToHistory, getToken, getMe,
  toggleFavorite, toggleArchive, isRateLimited, updateAccountLabel,
} from "@/lib/mailbox";
import type { SessionData, Message as Msg, MessageDetail, SavedAccount } from "@/lib/types";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<MessageDetail | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingMsg, setDeletingMsg] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [flashNewMsg, setFlashNewMsg] = useState(false);
  const [pollProgress, setPollProgress] = useState(0);
  const [pollKey, setPollKey] = useState(0);
  const sessionRef = useRef<SessionData | null>(null);
  const prevCountRef = useRef(0);

  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [switchingAccount, setSwitchingAccount] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [labelValue, setLabelValue] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  const [mobileView, setMobileView] = useState<"inbox" | "detail">("inbox");

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setSession(null);
    setMounted(true);
  }, []);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setShowDeleteConfirm(false);
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

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

  const copyPassword = useCallback(async () => {
    if (!session) return;
    try { await navigator.clipboard.writeText(session.password); }
    catch { /* noop */ }
    setCopiedPassword(true);
    addToast("Password copied", "success");
    setTimeout(() => setCopiedPassword(false), 2000);
  }, [session, addToast]);

  const doFetch = useCallback(async (token: string, opts?: { silent?: boolean; manual?: boolean }) => {
    if (!opts?.silent && !opts?.manual) setLoadingMessages(true);
    if (opts?.manual) {
      setRefreshing(true);
      setPollProgress(0);
    }
    try {
      const res = await getMessages(token);
      const newList = res["hydra:member"] ?? [];
      if (prevCountRef.current > 0 && newList.length > prevCountRef.current) {
        setFlashNewMsg(true);
        setTimeout(() => setFlashNewMsg(false), 1500);
      }
      prevCountRef.current = newList.length;
      setMessages(newList);
    } catch (err) {
      if (err instanceof Error && err.message === "Rate limited" && opts?.manual) {
        addToast("Rate limited. Waiting...", "error");
      }
    } finally {
      setLoadingMessages(false);
      setRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (!session) return;

    void (async () => {
      await doFetch(session.token);
    })();

    const cleanupSse = subscribeMercure(session.accountId, session.token, () => {
      setSseConnected(true);
      if (sessionRef.current) doFetch(sessionRef.current.token, { silent: true });
    });

    const poll = setInterval(() => {
      if (sseConnected) return;
      if (isRateLimited()) return;
      if (sessionRef.current) doFetch(sessionRef.current.token, { silent: true });
      setPollProgress(0);
      setPollKey((k) => k + 1);
      requestAnimationFrame(() => {
        setPollProgress(1);
      });
    }, 30000);

    requestAnimationFrame(() => {
      setPollProgress(1);
    });

    const progressTimer = setInterval(() => {
      setPollProgress(0);
      setPollKey((k) => k + 1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPollProgress(1);
        });
      });
    }, 30000);

    const sseTimeout = setTimeout(() => {
      setSseConnected(false);
    }, 10000);

    return () => {
      cleanupSse();
      clearInterval(poll);
      clearInterval(progressTimer);
      clearTimeout(sseTimeout);
    };
  }, [session, doFetch, sseConnected]);

  useEffect(() => {
    if (!session) return;

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        copyEmail();
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        doFetch(session!.token, { manual: true });
        addToast("Refreshing...", "info");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [session, doFetch, addToast, copyEmail]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        m.subject.toLowerCase().includes(q) ||
        m.from.name.toLowerCase().includes(q) ||
        m.from.address.toLowerCase().includes(q) ||
        m.intro.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  const sortedMessages = useMemo(() => {
    return [...filteredMessages].sort((a, b) => {
      if (a.seen === b.seen) return 0;
      return a.seen ? 1 : -1;
    });
  }, [filteredMessages]);

  const handleSelectMessage = async (msg: Msg) => {
    if (!session) return;
    setLoadingDetail(true);
    try {
      const detail = await getMessage(session.token, msg.id);
      setSelectedMsg(detail);
      setMobileView("detail");
      if (!msg.seen) {
        await markAsRead(session.token, msg.id);
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, seen: true } : m)));
      }
    } catch {
      addToast("Failed to load message", "error");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!session) return;
    setDeletingMsg(msgId);
    try {
      await deleteMessage(session.token, msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      if (selectedMsg?.id === msgId) {
        setSelectedMsg(null);
        setMobileView("inbox");
      }
      addToast("Message deleted", "success");
    } catch {
      addToast("Failed to delete message", "error");
    } finally {
      setDeletingMsg(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setMessages([]);
    setSelectedMsg(null);
    setProfileOpen(false);
    setShowHistory(false);
  };

  const handleDeleteAccount = async () => {
    if (!session) return;
    setDeletingAccount(true);
    setDeleteError("");
    try {
      await deleteAccount(session.token, session.accountId);
      removeSavedAccount(session.email);
      clearSession();
      setSession(null);
      setMessages([]);
      setSelectedMsg(null);
      setProfileOpen(false);
      setShowDeleteConfirm(false);
      addToast("Account deleted permanently", "success");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleSwitchAccount = async (acc: SavedAccount) => {
    setSwitchingAccount(acc.address);
    try {
      const tokenRes = await getToken(acc.address, acc.password);
      const meData = await getMe(tokenRes.token);
      clearSession();
      const newSession: SessionData = {
        token: tokenRes.token,
        email: acc.address,
        password: acc.password,
        accountId: meData.id,
      };
      saveSession(newSession);
      saveAccountToHistory(acc.address, acc.password);
      setSession(newSession);
      setMessages([]);
      setSelectedMsg(null);
      setProfileOpen(false);
      setShowHistory(false);
      addToast(`Switched to ${acc.address}`, "success");
    } catch {
      addToast("Failed to switch account. Credentials may be invalid.", "error");
    } finally {
      setSwitchingAccount(null);
    }
  };

  const handleRemoveSaved = (address: string) => {
    removeSavedAccount(address);
    setSavedAccounts(getSavedAccounts());
    if (address === session?.email) {
      clearSession();
      setSession(null);
      setMessages([]);
      setSelectedMsg(null);
    }
    addToast("Account removed from history", "info");
  };

  const handleToggleFavorite = (address: string) => {
    toggleFavorite(address);
    setSavedAccounts(getSavedAccounts());
  };

  const handleToggleArchive = (address: string) => {
    toggleArchive(address);
    setSavedAccounts(getSavedAccounts());
  };

  const handleSaveLabel = (address: string) => {
    updateAccountLabel(address, labelValue.trim());
    setSavedAccounts(getSavedAccounts());
    setEditingLabel(null);
    setLabelValue("");
  };

  const startEditLabel = (acc: SavedAccount) => {
    setEditingLabel(acc.address);
    setLabelValue(acc.label || "");
  };

  const handleCreateNew = () => {
    clearSession();
    setSession(null);
    setMessages([]);
    setSelectedMsg(null);
    setProfileOpen(false);
    setShowHistory(false);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  if (!session) {
    return <AuthForm onAuthenticated={() => setSession(getSession())} />;
  }

  const unreadCount = (messages ?? []).filter((m) => !m.seen).length;

  const activeAccounts = savedAccounts.filter((a) => !a.archived);
  const archivedAccounts = savedAccounts.filter((a) => a.archived);
  const sortedAccounts = [...activeAccounts].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return 0;
  });

  const activeAccountLabel = savedAccounts.find((a) => a.address === session.email)?.label;

  return (
    <div className="h-[100dvh] flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      <div className="absolute top-14 left-0 right-0 z-[90] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 flex flex-col gap-2 pointer-events-auto px-4 pt-2">
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
        </div>
      </div>

      <header className="relative h-12 border-b border-zinc-800 flex items-center justify-between px-2 sm:px-4 flex-shrink-0 z-[60]">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Mailbox" className="h-6 w-6 object-contain" />
          <span className="text-sm font-semibold tracking-tight hidden sm:block">Mailbox</span>
        </div>

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

          <button onClick={() => doFetch(session.token, { manual: true })} disabled={refreshing}
            aria-label="Refresh messages"
            className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <div className="relative" ref={profileRef}>
            <button onClick={() => { setProfileOpen(!profileOpen); if (!profileOpen) setSavedAccounts(getSavedAccounts()); }}
              aria-label="Account menu"
              className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
              <User className="w-3.5 h-3.5" />
            </button>

            {profileOpen && (
              <div className="absolute top-10 right-0 z-50 w-[calc(100vw-1rem)] max-w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in-up">
                <div className="p-3.5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      Connected as{activeAccountLabel ? ` — ${activeAccountLabel}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-zinc-200 truncate">{session.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-zinc-600">Password:</span>
                    <span className="text-[11px] font-mono text-zinc-400 flex-1 truncate">
                      {showProfilePassword ? session.password : "\u2022".repeat(10)}
                    </span>
                    <button onClick={() => setShowProfilePassword(!showProfilePassword)}
                      className="text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0">
                      {showProfilePassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button onClick={copyEmail}
                      className="flex-1 h-6 flex items-center justify-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors">
                      {copiedEmail ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      {copiedEmail ? "Copied" : "Email"}
                    </button>
                    <button onClick={copyPassword}
                      className="flex-1 h-6 flex items-center justify-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors">
                      {copiedPassword ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      {copiedPassword ? "Copied" : "Password"}
                    </button>
                  </div>
                </div>

                <div className="border-t border-zinc-800" />

                <div className="p-1.5">
                  <button onClick={handleCreateNew}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors">
                    <UserPlus className="w-3.5 h-3.5 text-zinc-500" />
                    New account
                  </button>
                  <button onClick={() => { setShowHistory(!showHistory); setShowDeleteConfirm(false); }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg transition-colors ${showHistory ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-300 hover:bg-zinc-800"}`}>
                    <History className="w-3.5 h-3.5 text-zinc-500" />
                    My accounts
                    {savedAccounts.length > 0 && (
                      <span className="ml-auto text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded-full">{savedAccounts.length}</span>
                    )}
                  </button>
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete account
                    </button>
                  ) : (
                    <div className="mx-2 my-1 p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg">
                      <p className="text-[11px] text-zinc-400 mb-2">Delete this account permanently?</p>
                      {deleteError && <p className="text-[11px] text-red-400 mb-2">{deleteError}</p>}
                      <div className="flex gap-1.5">
                        <button onClick={handleDeleteAccount} disabled={deletingAccount}
                          className="flex-1 h-7 px-2 bg-red-500 text-white text-[11px] font-medium rounded-md hover:bg-red-400 disabled:opacity-50 transition-all flex items-center justify-center gap-1">
                          {deletingAccount ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                        </button>
                        <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(""); }} disabled={deletingAccount}
                          className="flex-1 h-7 px-2 bg-zinc-800 text-zinc-300 text-[11px] font-medium rounded-md hover:bg-zinc-700 transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {showHistory && (
                  <>
                    <div className="border-t border-zinc-800" />
                    <div className="p-1.5">
                      <div className="flex items-center justify-between px-2.5 py-1">
                        <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">Accounts</p>
                        <button onClick={() => setShowArchived(!showArchived)}
                          className="text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors">
                          {showArchived ? "Show active" : `Archived (${archivedAccounts.length})`}
                        </button>
                      </div>
                      {(showArchived ? archivedAccounts : sortedAccounts).map((acc) => (
                        <div key={acc.address}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
                            acc.address === session.email ? "bg-indigo-500/10" : "hover:bg-zinc-800"
                          }`}>
                          <button onClick={() => handleToggleFavorite(acc.address)}
                            aria-label={acc.favorite ? "Remove from favorites" : "Add to favorites"}
                            className={`flex-shrink-0 transition-colors ${acc.favorite ? "text-amber-400" : "text-zinc-700 hover:text-zinc-500"}`}>
                            {acc.favorite ? <Star className="w-3 h-3" fill="currentColor" /> : <StarOff className="w-3 h-3" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            {editingLabel === acc.address ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={labelValue}
                                  onChange={(e) => setLabelValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveLabel(acc.address);
                                    if (e.key === "Escape") { setEditingLabel(null); setLabelValue(""); }
                                  }}
                                  autoFocus
                                  placeholder="Label..."
                                  className="flex-1 min-w-0 h-5 px-1.5 bg-[#09090b] border border-zinc-700 rounded text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
                                />
                                <button onClick={() => handleSaveLabel(acc.address)}
                                  className="text-emerald-400 hover:text-emerald-300 flex-shrink-0">
                                  <Check className="w-3 h-3" />
                                </button>
                                <button onClick={() => { setEditingLabel(null); setLabelValue(""); }}
                                  className="text-zinc-600 hover:text-zinc-400 flex-shrink-0">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="text-[11px] font-medium text-zinc-300 truncate flex items-center gap-1">
                                  {acc.label || acc.address}
                                  <button onClick={() => startEditLabel(acc)}
                                    className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                    aria-label="Edit label">
                                    <Pencil className="w-2.5 h-2.5" />
                                  </button>
                                </p>
                                {acc.label && (
                                  <p className="text-[9px] text-zinc-600 font-mono truncate">{acc.address}</p>
                                )}
                                {!acc.label && (
                                  <p className="text-[9px] text-zinc-600 font-mono truncate">{acc.password}</p>
                                )}
                              </>
                            )}
                          </div>
                          {acc.address !== session.email && (
                            <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleToggleArchive(acc.address)}
                                aria-label={acc.archived ? "Unarchive" : "Archive"}
                                className="w-5 h-5 flex items-center justify-center text-zinc-600 hover:text-zinc-400 rounded transition-colors">
                                {acc.archived ? <ArchiveRestore className="w-2.5 h-2.5" /> : <Archive className="w-2.5 h-2.5" />}
                              </button>
                              <button onClick={() => handleSwitchAccount(acc)} disabled={switchingAccount === acc.address}
                                className="h-5 px-1.5 text-[9px] font-medium text-indigo-400 bg-indigo-500/10 rounded hover:bg-indigo-500/20 transition-all disabled:opacity-50">
                                {switchingAccount === acc.address ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : "Go"}
                              </button>
                              <button onClick={() => handleRemoveSaved(acc.address)}
                                className="w-5 h-5 flex items-center justify-center text-zinc-700 hover:text-red-400 rounded transition-colors">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                          {acc.address === session.email && (
                            <span className="text-[9px] text-indigo-400 font-medium flex-shrink-0">Active</span>
                          )}
                        </div>
                      ))}
                      {(showArchived ? archivedAccounts : sortedAccounts).length === 0 && (
                        <p className="text-[11px] text-zinc-600 text-center py-3">
                          {showArchived ? "No archived accounts" : "No saved accounts"}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="border-t border-zinc-800" />
                <div className="p-1.5">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className={`w-full md:w-80 border-r border-zinc-800 flex flex-col flex-shrink-0 ${
          mobileView === "detail" ? "hidden md:flex" : "flex"
        } md:flex`}>
          <div className="relative h-10 border-b border-zinc-800 flex items-center px-4 justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Inbox className={`w-3.5 h-3.5 ${flashNewMsg ? "text-indigo-400 animate-pulse" : "text-zinc-500"}`} />
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Inbox</span>
              {unreadCount > 0 && (
                <span className="text-[9px] font-medium bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </div>
            <span className="text-[9px] text-zinc-600">{messages.length}</span>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
              <div key={pollProgress ? `fill-${pollKey}` : `reset-${pollKey}`}
                className={`h-full bg-indigo-500/30 ${pollProgress ? "animate-progress" : ""}`}
                style={{ transform: pollProgress ? undefined : "scaleX(0)" }} />
            </div>
          </div>

          {messages.length > 0 && (
            <div className="px-2.5 py-1.5 border-b border-zinc-800/50 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrer les messages..."
                  className="w-full h-7 pl-7 pr-2.5 bg-[#09090b] border border-zinc-800 rounded-md text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loadingMessages && messages.length === 0 ? (
              <div className="flex items-center justify-center h-32"><Loader2 className="w-4 h-4 text-zinc-600 animate-spin" /></div>
            ) : sortedMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
                <Mail className="w-7 h-7 mb-2 opacity-30" />
                <p className="text-[11px]">{searchQuery ? "Aucun message trouvé pour cette recherche" : "No messages yet"}</p>
              </div>
            ) : (
              sortedMessages.map((msg) => (
                <button key={msg.id} onClick={() => handleSelectMessage(msg)}
                  className={`w-full text-left px-3.5 py-3 md:py-2.5 border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/80 ${
                    selectedMsg?.id === msg.id ? "bg-zinc-900/80" : ""
                  }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      {msg.seen ? <MailOpen className="w-3.5 h-3.5 text-zinc-600" /> : <Mail className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs truncate ${msg.seen ? "text-zinc-500 font-normal" : "text-zinc-200 font-medium"}`}>
                          {msg.from.name || msg.from.address}
                        </span>
                        <span className="text-[9px] text-zinc-600 flex-shrink-0">{formatTime(msg.createdAt)}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${msg.seen ? "text-zinc-600" : "text-zinc-400"}`}>{msg.subject}</p>
                      <p className="text-[10px] text-zinc-600 truncate mt-0.5">{msg.intro}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className={`flex-1 flex flex-col min-w-0 ${
          mobileView === "inbox" ? "hidden md:flex" : "flex"
        } md:flex`}>
          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center"><Loader2 className="w-5 h-5 text-zinc-600 animate-spin" /></div>
          ) : selectedMsg ? (
            <div className="flex-1 flex flex-col min-h-0 animate-fade-in-up">
              <div className="border-b border-zinc-800 px-4 sm:px-6 py-3 flex-shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button onClick={() => { setSelectedMsg(null); setMobileView("inbox"); }}
                        className="md:hidden flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors -ml-1 text-xs">
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <h2 className="text-sm sm:text-base font-semibold text-zinc-100 truncate">{selectedMsg.subject}</h2>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-medium text-zinc-400">
                          {(selectedMsg.from.name || selectedMsg.from.address)[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-zinc-300">{selectedMsg.from.name || selectedMsg.from.address}</span>
                        <span className="text-[11px] text-zinc-600 ml-1.5 hidden sm:inline">&lt;{selectedMsg.from.address}&gt;</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1">To: {selectedMsg.to.map((t) => t.address).join(", ")}</p>
                    <p className="text-[10px] text-zinc-600">{new Date(selectedMsg.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDeleteMessage(selectedMsg.id)} disabled={deletingMsg === selectedMsg.id}
                    aria-label="Delete message"
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0">
                    {deletingMsg === selectedMsg.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {selectedMsg.attachments?.length > 0 && (
                <div className="border-b border-zinc-800 px-4 sm:px-6 py-2.5 flex-shrink-0">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Attachments ({selectedMsg.attachments.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMsg.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-1.5 h-6 px-2 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] text-zinc-400">
                        <Download className="w-3 h-3 text-zinc-600" />
                        <span className="truncate max-w-[120px]">{att.filename}</span>
                        <span className="text-zinc-700">({(att.size / 1024).toFixed(1)}KB)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {selectedMsg.html?.length > 0 ? (
                  <SecureMailIframe html={selectedMsg.html.join("")} />
                ) : (
                  <pre className="text-xs sm:text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{selectedMsg.text}</pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
              <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-zinc-700" />
              </div>
              <p className="text-xs font-medium text-zinc-500">Select a message</p>
              <p className="text-[10px] text-zinc-700 mt-0.5">Choose from the inbox to read</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
