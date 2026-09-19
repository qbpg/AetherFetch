"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
  }
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
  resetKey?: number;
}

export default function Turnstile({ siteKey, onVerify, onExpire, theme = "dark", className, resetKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const handleVerify = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  const handleExpire = useCallback(() => {
    onExpire?.();
  }, [onExpire]);

  useEffect(() => {
    if (!containerRef.current || !siteKey) return;

    const tryRender = () => {
      if (!window.turnstile || !containerRef.current) return false;
      if (widgetIdRef.current) return true;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        callback: handleVerify,
        "expired-callback": handleExpire,
        "error-callback": () => handleExpire(),
        appearance: "interaction-only",
      });
      return true;
    };

    if (tryRender()) return;

    const interval = setInterval(() => {
      if (tryRender()) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [siteKey, theme, handleVerify, handleExpire]);

  useEffect(() => {
    if (resetKey === undefined || resetKey === 0) return;
    if (widgetIdRef.current && window.turnstile) {
      try { window.turnstile.reset(widgetIdRef.current); } catch { /* noop */ }
    }
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* noop */ }
      }
    };
  }, []);

  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 ${className ?? ""}`}>
      <div ref={containerRef} />
    </div>
  );
}
