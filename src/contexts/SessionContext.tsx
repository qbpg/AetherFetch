"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { clearSession, getMessages, subscribeMercure, isRateLimited } from "@/lib/mailbox";
import type { SessionData, Message as Msg } from "@/lib/types";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface SessionContextValue {
  session: SessionData | null;
  setSession: (s: SessionData | null) => void;
  messages: Msg[];
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
  totalMessages: number;
  hasMoreMessages: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  sseConnected: boolean;
  doFetch: (token: string, opts?: { silent?: boolean; manual?: boolean }) => Promise<void>;
  addToast: (message: string, type?: Toast["type"]) => void;
  toasts: Toast[];
  handleLogout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

let toastId = 0;

function getInitialSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("mailbox_session");
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch { return null; }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [storedSession, setSessionState] = useState<SessionData | null>(() => getInitialSession());
  const session = hydrated ? storedSession : null;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sseConnected, setSseConnected] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const sessionRef = useRef<SessionData | null>(null);
  const prevCountRef = useRef(0);
  const connectedRef = useRef(false);
  const pendingFetchRef = useRef<{ token: string; promise: Promise<void> } | null>(null);
  const nextPageRef = useRef(2);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const setSession = useCallback((s: SessionData | null) => {
    if (sessionRef.current?.token !== s?.token) {
      setMessages([]);
      setTotalMessages(0);
      nextPageRef.current = 2;
      setSseConnected(false);
      connectedRef.current = false;
      prevCountRef.current = 0;
    }
    sessionRef.current = s;
    setSessionState(s);
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const doFetch = useCallback((token: string, opts?: { silent?: boolean; manual?: boolean }): Promise<void> => {
    if (pendingFetchRef.current?.token === token) return pendingFetchRef.current.promise;
    const promise = (async () => {
      try {
        const res = await getMessages(token);
        if (sessionRef.current?.token !== token) return;
        const newList = res["hydra:member"];
        if (prevCountRef.current > 0 && newList.length > prevCountRef.current) {
          addToast("New message received", "info");
        }
        prevCountRef.current = newList.length;
        setTotalMessages(res["hydra:totalItems"] ?? newList.length);
        setMessages((previous) => {
          const firstPageIds = new Set(newList.map((message) => message.id));
          return [...newList, ...previous.filter((message) => !firstPageIds.has(message.id))];
        });
      } catch (err) {
        if (opts?.manual) {
          addToast(err instanceof Error ? err.message : "Failed to refresh inbox", "error");
        } else if (!opts?.silent) {
          addToast("Could not load inbox. Retrying automatically.", "error");
        }
      }
    })();
    pendingFetchRef.current = { token, promise };
    void promise.finally(() => {
      if (pendingFetchRef.current?.promise === promise) pendingFetchRef.current = null;
    });
    return promise;
  }, [addToast]);

  const loadMore = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getMessages(current.token, nextPageRef.current);
      if (sessionRef.current?.token !== current.token) return;
      nextPageRef.current += 1;
      setTotalMessages(res["hydra:totalItems"] ?? 0);
      setMessages((previous) => {
        const known = new Set(previous.map((message) => message.id));
        return [...previous, ...res["hydra:member"].filter((message) => !known.has(message.id))];
      });
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Could not load more messages", "error");
    } finally {
      setLoadingMore(false);
    }
  }, [addToast, loadingMore]);

  useEffect(() => {
    if (!session) return;

    void doFetch(session.token);

    const cleanupSse = subscribeMercure(session.accountId, session.token, () => {
      if (sessionRef.current) void doFetch(sessionRef.current.token, { silent: true });
    }, (connected) => {
      connectedRef.current = connected;
      setSseConnected(connected);
    });

    const poll = setInterval(() => {
      if (connectedRef.current) return;
      if (isRateLimited()) return;
      if (sessionRef.current) doFetch(sessionRef.current.token, { silent: true });
    }, 30000);

    return () => {
      cleanupSse();
      clearInterval(poll);
      connectedRef.current = false;
    };
  }, [session, doFetch]);

  const handleLogout = useCallback(() => {
    clearSession();
    setSession(null);
    window.location.replace("/");
  }, [setSession]);

  return (
    <SessionContext.Provider value={{ session, setSession, messages, setMessages, totalMessages, hasMoreMessages: messages.length < totalMessages, loadingMore, loadMore, sseConnected, doFetch, addToast, toasts, handleLogout }}>
      {children}
    </SessionContext.Provider>
  );
}
