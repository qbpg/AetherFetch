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
  img, video, source { max-width: 100%; height: auto; display: block; }
  video { max-width: 100%; }
  pre { white-space: pre-wrap; font-family: inherit; }
  * { color: inherit; box-sizing: border-box; }
  table { border-collapse: collapse; max-width: 100%; }
  td, th { padding: 4px 8px; }
  figure { margin: 0; max-width: 100%; }
  picture { display: block; max-width: 100%; }
  picture img { width: 100%; }
  [style*="background-image"] { background-size: cover; background-position: center; }
  .gmail-text { overflow: visible !important; }
  .ii.gt { max-width: 100% !important; overflow: visible !important; }
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

    const onResourceLoad = () => { resize(); };

    doc.addEventListener("click", handleClick);
    doc.querySelectorAll("img, video, source").forEach((el) => {
      el.addEventListener("load", onResourceLoad);
    });
    const observer = new MutationObserver(() => {
      resize();
      doc.querySelectorAll("img, video, source").forEach((el) => {
        el.removeEventListener("load", onResourceLoad);
        el.addEventListener("load", onResourceLoad);
      });
    });
    observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
    resize();
    const timer = setTimeout(resize, 300);

    return () => {
      observer.disconnect();
      doc.removeEventListener("click", handleClick);
      doc.querySelectorAll("img, video, source").forEach((el) => {
        el.removeEventListener("load", onResourceLoad);
      });
      clearTimeout(timer);
    };
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin allow-popups"
      title="Email content"
      translate="no"
      className={`w-full border-0 bg-transparent ${className ?? ""}`}
      style={{ minHeight: 100 }}
    />
  );
}
