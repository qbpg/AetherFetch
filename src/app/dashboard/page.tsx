"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, MailOpen, Trash2,
  Download, Inbox, Search, ChevronLeft, X,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import SecureMailIframe from "@/components/SecureMailIframe";
import { getMessage, deleteMessage, markAsRead } from "@/lib/mailbox";
import type { Message as Msg, MessageDetail } from "@/lib/types";

export default function DashboardPage() {
  const { session, messages, setMessages, doFetch, addToast } = useSession();
  const router = useRouter();
  const [selectedMsg, setSelectedMsg] = useState<MessageDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deletingMsg, setDeletingMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"inbox" | "detail">("inbox");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!session) { router.replace("/home"); return; }
    setInitialLoading(true);
    doFetch(session.token).finally(() => setInitialLoading(false));
  }, [session, router, doFetch]);

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
    addToast("Email copied", "success");
  }, [session, addToast]);

  useEffect(() => {
    if (!session) return;
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (e.key === "c" || e.key === "C") { e.preventDefault(); copyEmail(); }
      if ((e.key === "r" || e.key === "R") && session) { e.preventDefault(); doFetch(session.token, { manual: true }); addToast("Refreshing...", "info"); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [session, doFetch, addToast, copyEmail]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) => m.subject.toLowerCase().includes(q) || m.from.name.toLowerCase().includes(q) || m.from.address.toLowerCase().includes(q) || m.intro.toLowerCase().includes(q)
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
      if (selectedMsg?.id === msgId) { setSelectedMsg(null); setMobileView("inbox"); }
      addToast("Message deleted", "success");
    } catch {
      addToast("Failed to delete message", "error");
    } finally {
      setDeletingMsg(null);
    }
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

  if (!session) return <div className="min-h-screen bg-[#09090b]" />;

  const unreadCount = messages.filter((m) => !m.seen).length;

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className={`w-full md:w-80 border-r border-zinc-800 flex flex-col flex-shrink-0 ${mobileView === "detail" ? "hidden md:flex" : "flex"} md:flex`}>
        <div className="relative h-10 border-b border-zinc-800 flex items-center px-4 justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Inbox className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Inbox</span>
            {unreadCount > 0 && <span className="text-[9px] font-medium bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
          </div>
          <span className="text-[9px] text-zinc-600">{messages.length}</span>
        </div>

        {messages.length > 0 && (
          <div className="px-2.5 py-1.5 border-b border-zinc-800/50 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer les messages..."
                className="w-full h-7 pl-7 pr-2.5 bg-[#09090b] border border-zinc-800 rounded-md text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 transition-colors" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {initialLoading && messages.length === 0 ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-3.5 py-3 border-b border-zinc-800/50 animate-pulse">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-3.5 h-3.5 rounded bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-2.5 bg-zinc-800 rounded w-24" />
                        <div className="h-2 bg-zinc-800 rounded w-6" />
                      </div>
                      <div className="h-2.5 bg-zinc-800 rounded w-36" />
                      <div className="h-2 bg-zinc-800 rounded w-48" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <Inbox className="w-5 h-5 text-zinc-700" />
              </div>
              <p className="text-xs font-medium text-zinc-500">No messages yet</p>
              <p className="text-[10px] text-zinc-700 mt-0.5">Waiting for incoming mail...</p>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
              <Mail className="w-7 h-7 mb-2 opacity-30" />
              <p className="text-[11px]">{searchQuery ? "Aucun message trouvé pour cette recherche" : "No messages yet"}</p>
            </div>
          ) : (
            sortedMessages.map((msg) => (
              <button key={msg.id} onClick={() => handleSelectMessage(msg)}
                className={`w-full text-left px-3.5 py-3 md:py-2.5 border-b border-zinc-800/50 transition-colors hover:bg-zinc-900/80 ${selectedMsg?.id === msg.id ? "bg-zinc-900/80" : ""}`}>
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

      <main className={`flex-1 flex flex-col min-w-0 ${mobileView === "inbox" ? "hidden md:flex" : "flex"} md:flex`}>
        {loadingDetail ? (
          <div className="flex-1 flex items-center justify-center"><div className="w-5 h-5 rounded-full bg-zinc-900/50" /></div>
        ) : selectedMsg ? (
          <div className="flex-1 flex flex-col min-h-0 animate-fade-in-up">
            <div className="border-b border-zinc-800 px-4 sm:px-6 py-3 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button onClick={() => { setSelectedMsg(null); setMobileView("inbox"); }}
                      className="md:hidden flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors -ml-1 text-xs">
                      <ChevronLeft className="w-4 h-4" /><span>Back</span>
                    </button>
                    <h2 className="text-sm sm:text-base font-semibold text-zinc-100 truncate">{selectedMsg.subject}</h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-medium text-zinc-400">{(selectedMsg.from.name || selectedMsg.from.address)[0]?.toUpperCase()}</span>
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
                  className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 disabled:opacity-40">
                  <Trash2 className="w-3.5 h-3.5" />
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
  );
}
