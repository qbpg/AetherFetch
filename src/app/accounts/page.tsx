"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Eye, EyeOff, Copy, Check, Trash2, Star, StarOff,
  Archive, ArchiveRestore, X, Pencil,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import {
  getSavedAccounts, removeSavedAccount, saveAccountToHistory,
  toggleFavorite, toggleArchive, updateAccountLabel,
  getToken, getMe, deleteAccount, clearSession,
} from "@/lib/mailbox";
import type { SavedAccount } from "@/lib/types";

export default function AccountsPage() {
  const { session, setSession, addToast } = useSession();
  const router = useRouter();
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("mailbox_saved_accounts");
      return raw ? (JSON.parse(raw) as SavedAccount[]) : [];
    } catch { return []; }
  });
  const [showArchived, setShowArchived] = useState(false);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [labelValue, setLabelValue] = useState("");
  const [switchingAccount, setSwitchingAccount] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const refreshAccounts = useCallback(() => {
    setSavedAccounts(getSavedAccounts());
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

  const handleRemoveSaved = (address: string) => {
    removeSavedAccount(address);
    refreshAccounts();
    if (address === session?.email) {
      clearSession();
      setSession(null);
    }
    addToast("Account removed from history", "info");
  };

  const handleToggleFavorite = (address: string) => {
    toggleFavorite(address);
    refreshAccounts();
  };

  const handleToggleArchive = (address: string) => {
    toggleArchive(address);
    refreshAccounts();
  };

  const handleSaveLabel = (address: string) => {
    updateAccountLabel(address, labelValue.trim());
    refreshAccounts();
    setEditingLabel(null);
    setLabelValue("");
  };

  const startEditLabel = (acc: SavedAccount) => {
    setEditingLabel(acc.address);
    setLabelValue(acc.label || "");
  };

  const handleSwitchAccount = async (acc: SavedAccount) => {
    setSwitchingAccount(acc.address);
    try {
      const tokenRes = await getToken(acc.address, acc.password);
      const meData = await getMe(tokenRes.token);
      clearSession();
      const newSession = { token: tokenRes.token, email: acc.address, password: acc.password, accountId: meData.id };
      const { saveSession } = await import("@/lib/mailbox");
      saveSession(newSession);
      saveAccountToHistory(acc.address, acc.password);
      setSession(newSession);
      addToast(`Switched to ${acc.address}`, "success");
    } catch {
      addToast("Failed to switch account. Credentials may be invalid.", "error");
    } finally {
      setSwitchingAccount(null);
    }
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
      addToast("Account deleted permanently", "success");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!session) {
    if (typeof window !== "undefined") router.replace("/home");
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  const activeAccounts = savedAccounts.filter((a) => !a.archived);
  const archivedAccounts = savedAccounts.filter((a) => a.archived);
  const sortedAccounts = [...activeAccounts].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return 0;
  });
  const displayList = showArchived ? archivedAccounts : sortedAccounts;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-lg font-semibold text-zinc-100 mb-1">Accounts</h1>
        <p className="text-xs text-zinc-500 mb-6">Manage your saved accounts, labels and preferences.</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Connected as</p>
          </div>
          <p className="text-sm font-medium text-zinc-200 truncate">{session.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-zinc-600">Password:</span>
            <span className="text-[11px] font-mono text-zinc-400 flex-1 truncate">
              {showPassword ? session.password : "\u2022".repeat(10)}
            </span>
            <button onClick={() => setShowPassword(!showPassword)} className="text-zinc-600 hover:text-zinc-400 transition-colors">
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <button onClick={copyEmail} className="flex-1 h-7 flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors">
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedEmail ? "Copied" : "Copy email"}
            </button>
            <button onClick={copyPassword} className="flex-1 h-7 flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors">
              {copiedPassword ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedPassword ? "Copied" : "Copy password"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-300">Saved Accounts</h2>
          <button onClick={() => setShowArchived(!showArchived)}
            className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
            {showArchived ? "Show active" : `Archived (${archivedAccounts.length})`}
          </button>
        </div>

        <div className="space-y-1.5">
          {displayList.map((acc) => (
            <div key={acc.address}
              className={`flex items-center gap-2 px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl transition-colors group ${
                acc.address === session.email ? "ring-1 ring-indigo-500/30" : ""
              }`}>
              <button onClick={() => handleToggleFavorite(acc.address)}
                aria-label={acc.favorite ? "Remove from favorites" : "Add to favorites"}
                className={`flex-shrink-0 transition-colors ${acc.favorite ? "text-amber-400" : "text-zinc-700 hover:text-zinc-500"}`}>
                {acc.favorite ? <Star className="w-3.5 h-3.5" fill="currentColor" /> : <StarOff className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 min-w-0">
                {editingLabel === acc.address ? (
                  <div className="flex items-center gap-1">
                    <input type="text" value={labelValue} onChange={(e) => setLabelValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveLabel(acc.address); if (e.key === "Escape") { setEditingLabel(null); setLabelValue(""); } }}
                      autoFocus placeholder="Label..."
                      className="flex-1 min-w-0 h-6 px-2 bg-[#09090b] border border-zinc-700 rounded-md text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50" />
                    <button onClick={() => handleSaveLabel(acc.address)} className="text-emerald-400 hover:text-emerald-300"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { setEditingLabel(null); setLabelValue(""); }} className="text-zinc-600 hover:text-zinc-400"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-zinc-300 truncate flex items-center gap-1.5">
                      {acc.label || acc.address}
                      <button onClick={() => startEditLabel(acc)}
                        className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="w-2.5 h-2.5" />
                      </button>
                    </p>
                    {acc.label && <p className="text-[10px] text-zinc-600 font-mono truncate">{acc.address}</p>}
                    {!acc.label && <p className="text-[10px] text-zinc-600 font-mono truncate">{acc.password}</p>}
                  </>
                )}
              </div>
              {acc.address === session.email ? (
                <span className="text-[10px] text-indigo-400 font-medium flex-shrink-0">Active</span>
              ) : (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleToggleArchive(acc.address)} aria-label={acc.archived ? "Unarchive" : "Archive"}
                    className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-400 rounded transition-colors">
                    {acc.archived ? <ArchiveRestore className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                  </button>
                  <button onClick={() => handleSwitchAccount(acc)} disabled={switchingAccount === acc.address}
                    className="h-6 px-2 text-[10px] font-medium text-indigo-400 bg-indigo-500/10 rounded hover:bg-indigo-500/20 transition-all disabled:opacity-50">
                    {switchingAccount === acc.address ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : "Switch"}
                  </button>
                  <button onClick={() => handleRemoveSaved(acc.address)}
                    className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:text-red-400 rounded transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {displayList.length === 0 && (
            <p className="text-xs text-zinc-600 text-center py-6">
              {showArchived ? "No archived accounts" : "No saved accounts"}
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-9 flex items-center justify-center gap-2 text-xs text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete current account
            </button>
          ) : (
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
              <p className="text-[11px] text-zinc-400 mb-2">Delete this account permanently?</p>
              {deleteError && <p className="text-[11px] text-red-400 mb-2">{deleteError}</p>}
              <div className="flex gap-1.5">
                <button onClick={handleDeleteAccount} disabled={deletingAccount}
                  className="flex-1 h-8 px-2 bg-red-500 text-white text-[11px] font-medium rounded-md hover:bg-red-400 disabled:opacity-50 transition-all flex items-center justify-center gap-1">
                  {deletingAccount ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(""); }} disabled={deletingAccount}
                  className="flex-1 h-8 px-2 bg-zinc-800 text-zinc-300 text-[11px] font-medium rounded-md hover:bg-zinc-700 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
