"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, MailOpen, Trash2,
  Download, Inbox, Search, ChevronLeft, X,
  RefreshCw, Clock, Wifi, WifiOff, Hash,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import SecureMailIframe from "@/components/SecureMailIframe";
import { getMessage, deleteMessage, markAsRead } from "@/lib/mailbox";
import type { Message as Msg, MessageDetail } from "@/lib/types";

export default function DashboardPage() {
  const { session, messages, setMessages, doFetch, sseConnected, addToast } = useSession();
  const router = useRouter();
  const [selectedMsg, setSelectedMsg] = useState<MessageDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deletingMsg, setDeletingMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"inbox" | "detail">("inbox");
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const messageCache = useRef<Map<string, MessageDetail>>(new Map());


  useEffect(() => {
    if (!session) { router.replace("/"); return; }
    setInitialLoading(true);
    doFetch(session.token).finally(() => setInitialLoading(false));
  }, [session, router, doFetch]);

  useEffect(() => {
    if (!session || messages.length === 0) return;
    for (const msg of messages) {
      if (!messageCache.current.has(msg.id) && !msg.seen) {
        getMessage(session.token, msg.id).then((detail) => {
          messageCache.current.set(msg.id, detail);
        }).catch(() => {});
      }
    }
  }, [session, messages]);

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
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        copyEmail();
      }
      if ((e.key === "r" || e.key === "R") && session) {
        e.preventDefault();
        setRefreshing(true);
        doFetch(session.token, { manual: true }).finally(() => setRefreshing(false));
        addToast("Refreshing...", "info");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
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

    const cached = messageCache.current.get(msg.id);
    if (cached) {
      setSelectedMsg(cached);
      setMobileView("detail");
      return;
    }

    setLoadingDetail(true);
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 800;
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const detail = await getMessage(session.token, msg.id);
        messageCache.current.set(msg.id, detail);
        setSelectedMsg(detail);
        setMobileView("detail");
        setLoadingDetail(false);
        if (!msg.seen) {
          markAsRead(session.token, msg.id).then(() => {
            setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, seen: true } : m)));
          }).catch(() => {});
        }
        return;
      } catch (err) {
        lastError = err;
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
      }
    }
    setLoadingDetail(false);
    const msg2 = lastError instanceof Error ? lastError.message : "Failed to load message";
    addToast(msg2, "error");
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!session) return;
    setDeletingMsg(msgId);
    try {
      await deleteMessage(session.token, msgId);
      messageCache.current.delete(msgId);
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
  const totalCount = messages.length;

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className={`w-full md:w-80 lg:w-96 border-r border-zinc-800 flex flex-col flex-shrink-0 ${mobileView === "detail" ? "hidden md:flex" : "flex"} md:flex`}>
        {/* Stats bar */}
        <div className="h-10 border-b border-zinc-800 flex items-center px-4 sm:px-5 gap-3 flex-shrink-0 bg-zinc-900/30">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${sseConnected ? "bg-emerald-400 animate-pulse-dot" : "bg-zinc-600"}`} />
            <span className="text-[10px] text-zinc-500 font-medium">{sseConnected ? "Live" : "Polling"}</span>
          </div>
          <div className="w-px h-3 bg-zinc-800" />
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3 text-zinc-600" />
            <span className="text-[10px] text-zinc-500 font-mono">{totalCount}</span>
          </div>
          {unreadCount > 0 && (
            <>
              <div className="w-px h-3 bg-zinc-800" />
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-zinc-100" />
                <span className="text-[10px] text-zinc-100 font-mono">{unreadCount} new</span>
              </div>
            </>
          )}
        </div>

        {/* Inbox header */}
        <div className="relative h-12 border-b border-zinc-800 flex items-center px-4 sm:px-5 justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Inbox</span>
          </div>
          <button
            onClick={() => { setRefreshing(true); doFetch(session.token, { manual: true }).finally(() => setRefreshing(false)); addToast("Refreshing...", "info"); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Search */}
        {messages.length > 0 && (
          <div className="px-3 py-2 border-b border-zinc-800 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter messages..."
                className="w-full h-8 pl-8 pr-3 bg-[#09090b] border border-zinc-800 rounded-md text-xs text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Message list */}
        <div className="flex-1 overflow-y-auto">
          {initialLoading && messages.length === 0 ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-4 py-3.5 border-b border-zinc-800 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-4 h-4 rounded bg-zinc-800" />
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="h-3 bg-zinc-800 rounded w-28" />
                        <div className="h-2.5 bg-zinc-800 rounded w-8" />
                      </div>
                      <div className="h-3 bg-zinc-800 rounded w-40" />
                      <div className="h-2.5 bg-zinc-800 rounded w-52" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Inbox className="w-7 h-7 text-zinc-700" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-zinc-500" />
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-300">No messages yet</p>
              <p className="text-xs text-zinc-500 mt-1 text-center max-w-[200px]">
                Waiting for incoming mail to <span translate="no" className="font-mono text-zinc-400">{session.email}</span>
              </p>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
              <Mail className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">{searchQuery ? "No messages match your search" : "No messages yet"}</p>
            </div>
          ) : (
            sortedMessages.map((msg) => (
              <button key={msg.id} onClick={() => handleSelectMessage(msg)}
                className={`w-full text-left px-4 py-3.5 md:py-3 border-b border-zinc-800 transition-all duration-150 hover:bg-zinc-900/80 ${
                  selectedMsg?.id === msg.id
                    ? "bg-zinc-900 border-l-2 border-l-zinc-50"
                    : "border-l-2 border-l-transparent"
                } ${!msg.seen ? "bg-zinc-900/50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {msg.seen ? (
                      <MailOpen className="w-4 h-4 text-zinc-600" />
                    ) : (
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-100" />
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${msg.seen ? "text-zinc-400 font-normal" : "text-zinc-50 font-medium"}`}>
                        {msg.from.name || msg.from.address}
                      </span>
                      <span className="text-[10px] text-zinc-500 flex-shrink-0 font-mono">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${msg.seen ? "text-zinc-500" : "text-zinc-300"}`}>{msg.subject}</p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5 leading-relaxed">{msg.intro}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Detail pane */}
      <main className={`flex-1 flex flex-col min-w-0 ${mobileView === "inbox" ? "hidden md:flex" : "flex"} md:flex`}>
        {loadingDetail ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-zinc-400 animate-spin" />
            <p className="text-xs text-zinc-500">Loading message...</p>
          </div>
        ) : selectedMsg ? (
          <div className="flex-1 flex flex-col min-h-0 animate-fade-in-up">
            {/* Message header */}
            <div className="border-b border-zinc-800 px-5 sm:px-7 py-4 flex-shrink-0 bg-zinc-900/20">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <button onClick={() => { setSelectedMsg(null); setMobileView("inbox"); }}
                      className="md:hidden flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors -ml-1 text-sm">
                      <ChevronLeft className="w-4 h-4" /><span>Back</span>
                    </button>
                    <h2 className="text-base sm:text-lg font-semibold text-zinc-100 truncate">{selectedMsg.subject}</h2>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-zinc-300">{(selectedMsg.from.name || selectedMsg.from.address)[0]?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-300 font-medium">{selectedMsg.from.name || selectedMsg.from.address}</p>
                      <p className="text-[11px] text-zinc-500 font-mono truncate" translate="no">{selectedMsg.from.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[11px] text-zinc-500">
                      To: <span translate="no" className="font-mono">{selectedMsg.to.map((t) => t.address).join(", ")}</span>
                    </p>
                    <span className="text-zinc-700">|</span>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedMsg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDeleteMessage(selectedMsg.id)} disabled={deletingMsg === selectedMsg.id}
                  aria-label="Delete message"
                  className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Attachments */}
            {selectedMsg.attachments?.length > 0 && (
              <div className="border-b border-zinc-800 px-5 sm:px-7 py-3 flex-shrink-0 bg-zinc-900/10">
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 font-medium">Attachments ({selectedMsg.attachments.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMsg.attachments.map((att) => (
                    <div key={att.id} className="flex items-center gap-1.5 h-7 px-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-[11px] text-zinc-400 hover:border-zinc-700 transition-colors cursor-default">
                      <Download className="w-3 h-3 text-zinc-600" />
                      <span className="truncate max-w-[140px]">{att.filename}</span>
                      <span className="text-zinc-700">({(att.size / 1024).toFixed(1)}KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8">
              {selectedMsg.html?.length > 0 ? (
                <SecureMailIframe html={selectedMsg.html.join("")} />
              ) : (
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{selectedMsg.text}</pre>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Inbox className="w-8 h-8 text-zinc-700" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[10px] font-bold text-zinc-950">{unreadCount}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-zinc-300">Select a message</p>
            <p className="text-xs text-zinc-500 mt-1">Choose from the inbox to read</p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span translate="no" className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded font-mono text-zinc-400">C</span>
                <span>Copy email</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span translate="no" className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded font-mono text-zinc-400">R</span>
                <span>Refresh</span>
              </div>
            </div>
          </div>
        )}
      </main>


    </div>
  );
}
