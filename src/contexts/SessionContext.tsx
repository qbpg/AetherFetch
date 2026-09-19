"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
  const [session, setSessionState] = useState<SessionData | null>(() => getInitialSession());
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sseConnected, setSseConnected] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const sessionRef = useRef<SessionData | null>(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const setSession = useCallback((s: SessionData | null) => {
    setSessionState(s);
    if (!s) {
      setMessages([]);
      setSseConnected(false);
    }
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const doFetch = useCallback(async (token: string, opts?: { silent?: boolean; manual?: boolean }) => {
    try {
      const res = await getMessages(token);
      const newList = res["hydra:member"] ?? [];
      if (prevCountRef.current > 0 && newList.length > prevCountRef.current) {
        addToast("New message received", "info");
      }
      prevCountRef.current = newList.length;
      setMessages(newList);
    } catch (err) {
      if (err instanceof Error && err.message === "Rate limited" && opts?.manual) {
        addToast("Rate limited. Waiting...", "error");
      }
    }
  }, [addToast]);

  useEffect(() => {
    if (!session) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount
    void doFetch(session.token);

    const cleanupSse = subscribeMercure(session.accountId, session.token, () => {
      setSseConnected(true);
      if (sessionRef.current) doFetch(sessionRef.current.token, { silent: true });
    });

    const poll = setInterval(() => {
      if (sseConnected) return;
      if (isRateLimited()) return;
      if (sessionRef.current) doFetch(sessionRef.current.token, { silent: true });
    }, 30000);

    const sseTimeout = setTimeout(() => {
      setSseConnected(false);
    }, 10000);

    return () => {
      cleanupSse();
      clearInterval(poll);
      clearTimeout(sseTimeout);
    };
  }, [session, doFetch, sseConnected]);

  const handleLogout = useCallback(() => {
    clearSession();
    setSession(null);
  }, [setSession]);

  return (
    <SessionContext.Provider value={{ session, setSession, messages, setMessages, sseConnected, doFetch, addToast, toasts, handleLogout }}>
      {children}
    </SessionContext.Provider>
  );
}
