"use client";

import { useEffect, useRef } from "react";

interface SecureMailIframeProps {
  html: string;
  className?: string;
}

export default function SecureMailIframe({ html, className }: SecureMailIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    margin: 0;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #d4d4d8;
    background: transparent;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  a { color: #818cf8; text-decoration: underline; text-underline-offset: 2px; }
  a:hover { color: #a5b4fc; }
  img { max-width: 100%; height: auto; }
  pre { white-space: pre-wrap; font-family: inherit; }
  * { color: inherit; }
</style>
</head>
<body>${html}</body>
</html>`);
    doc.close();

    const resize = () => {
      try {
        iframe.style.height = `${doc.body.scrollHeight + 32}px`;
      } catch { /* noop */ }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && link.href) {
        e.preventDefault();
        window.open(link.href, "_blank", "noopener,noreferrer");
      }
    };

    doc.addEventListener("click", handleClick);
    resize();
    const timer = setTimeout(resize, 200);

    return () => {
      doc.removeEventListener("click", handleClick);
      clearTimeout(timer);
    };
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin"
      title="Email content"
      className={`w-full border-0 bg-transparent ${className ?? ""}`}
      style={{ minHeight: 100 }}
    />
  );
}
