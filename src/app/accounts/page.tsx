"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Eye, EyeOff, Copy, Check, Trash2, Star,
  Archive, ArchiveRestore, X, Pencil, Plus, ArrowRight,
  Shield, ChevronRight, Mail,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import {
  getSavedAccounts, removeSavedAccount,
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

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const i = document.createElement("input");
      i.value = text;
      document.body.appendChild(i);
      i.select();
      document.execCommand("copy");
      document.body.removeChild(i);
    }
    if (label === "email") {
      setCopiedEmail(true);
      addToast("Email copied", "success");
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      addToast("Password copied", "success");
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  }, [addToast]);

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
    return <div className="min-h-screen bg-zinc-950" />;
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Accounts</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your mailboxes and credentials</p>
          </div>
          <Link href="/home"
            className="h-8 px-3.5 flex items-center gap-1.5 text-xs font-medium text-zinc-100 bg-white hover:bg-zinc-200 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Account
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 sm:p-5 mb-6 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Active session</span>
                </div>
                <p className="text-sm font-medium text-zinc-200 truncate">{session.email}</p>
              </div>
            </div>
            <Link href="/dashboard"
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0 ml-3">
              Dashboard
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">Password</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 flex-1 truncate">
                {showPassword ? session.password : "\u2022".repeat(16)}
              </span>
              <button onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-600 hover:text-zinc-400 transition-colors p-1 rounded">
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <button onClick={() => copyToClipboard(session.email, "email")}
                className="flex-1 h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors">
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEmail ? "Copied" : "Copy email"}
              </button>
              <button onClick={() => copyToClipboard(session.password, "password")}
                className="flex-1 h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors">
                {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPassword ? "Copied" : "Copy password"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
          <button onClick={() => setShowArchived(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              !showArchived
                ? "text-zinc-100 bg-zinc-800"
                : "text-zinc-500 hover:text-zinc-300"
            }`}>
            Active
            {activeAccounts.length > 0 && (
              <span className="ml-1.5 text-[10px] text-zinc-600">{activeAccounts.length}</span>
            )}
          </button>
          <button onClick={() => setShowArchived(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              showArchived
                ? "text-zinc-100 bg-zinc-800"
                : "text-zinc-500 hover:text-zinc-300"
            }`}>
            Archived
            {archivedAccounts.length > 0 && (
              <span className="ml-1.5 text-[10px] text-zinc-600">{archivedAccounts.length}</span>
            )}
          </button>
        </div>

        <div className="space-y-2">
          {displayList.map((acc) => (
            <div key={acc.address}
              className={`group bg-zinc-900 border rounded-xl p-3 sm:p-4 transition-all hover:border-zinc-700 ${
                acc.address === session.email
                  ? "border-zinc-700 ring-1 ring-white/5"
                  : "border-zinc-800"
              }`}>
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggleFavorite(acc.address)}
                  aria-label={acc.favorite ? "Remove from favorites" : "Add to favorites"}
                  className={`flex-shrink-0 transition-colors ${acc.favorite ? "text-amber-400" : "text-zinc-700 hover:text-zinc-500"}`}>
                  <Star className={`w-4 h-4 ${acc.favorite ? "fill-current" : ""}`} />
                </button>

                <div className="flex-1 min-w-0">
                  {editingLabel === acc.address ? (
                    <div className="flex items-center gap-1.5">
                      <input type="text" value={labelValue} onChange={(e) => setLabelValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveLabel(acc.address); if (e.key === "Escape") { setEditingLabel(null); setLabelValue(""); } }}
                        autoFocus placeholder="Label..."
                        className="flex-1 min-w-0 h-7 px-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors" />
                      <button onClick={() => handleSaveLabel(acc.address)}
                        className="w-7 h-7 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors rounded">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setEditingLabel(null); setLabelValue(""); }}
                        className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-zinc-200 truncate flex items-center gap-2">
                        {acc.label || acc.address}
                        {acc.label && (
                          <button onClick={() => startEditLabel(acc)}
                            className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="w-3 h-3" />
                          </button>
                        )}
                      </p>
                      {acc.label && <p className="text-[11px] text-zinc-500 font-mono truncate mt-0.5">{acc.address}</p>}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {acc.address === session.email ? (
                    <span className="h-7 px-2.5 flex items-center text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      Active
                    </span>
                  ) : (
                    <>
                      <button onClick={() => handleToggleArchive(acc.address)}
                        aria-label={acc.archived ? "Unarchive" : "Archive"}
                        className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        {acc.archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleSwitchAccount(acc)} disabled={switchingAccount === acc.address}
                        className="h-7 px-2.5 flex items-center gap-1 text-[11px] font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all disabled:opacity-50">
                        {switchingAccount === acc.address
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <>Switch <ArrowRight className="w-3 h-3" /></>
                        }
                      </button>
                      <button onClick={() => handleRemoveSaved(acc.address)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {displayList.length === 0 && (
            <div className="text-center py-12">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-5 h-5 text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-500 mb-1">
                {showArchived ? "No archived accounts" : "No saved accounts"}
              </p>
              <p className="text-xs text-zinc-600">
                {showArchived ? "Archived accounts will appear here" : "Create or connect an account to get started"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-9 flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-red-400 bg-transparent hover:bg-red-500/5 border border-zinc-800 hover:border-red-500/20 rounded-xl transition-all">
              <Trash2 className="w-3.5 h-3.5" />
              Delete current account
            </button>
          ) : (
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <p className="text-xs text-zinc-400 mb-3">This will permanently delete this account and all its data. This action cannot be undone.</p>
              {deleteError && <p className="text-xs text-red-400 mb-3">{deleteError}</p>}
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} disabled={deletingAccount}
                  className="flex-1 h-8 px-3 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-400 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5">
                  {deletingAccount ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm delete"}
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(""); }} disabled={deletingAccount}
                  className="flex-1 h-8 px-3 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg hover:bg-zinc-700 border border-zinc-700 transition-all">
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
