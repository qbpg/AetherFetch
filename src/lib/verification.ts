import type { MessageDetail } from "./types";

export interface VerificationResult {
  code: string | null;
  link: string | null;
}

const CODE_CONTEXT = /(?:verification|security|confirmation|one[- ]time|passcode|otp|code|pin)[^\d]{0,40}(\d{4,8})/i;
const STANDALONE_CODE = /(?:^|\D)(\d{6})(?!\d)/;
const LINK_CONTEXT = /verify|confirm|activate|complete|continue|sign.?in|login/i;

export function extractVerification(message: MessageDetail): VerificationResult {
  const html = message.html?.join(" ") || "";
  const plain = `${message.subject || ""} ${message.intro || ""} ${message.text || ""}`;
  const htmlText = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ");
  const combined = `${plain} ${htmlText}`;
  const code = combined.match(CODE_CONTEXT)?.[1] || combined.match(STANDALONE_CODE)?.[1] || null;

  let link: string | null = null;
  if (typeof DOMParser !== "undefined" && html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    for (const anchor of Array.from(doc.querySelectorAll("a[href]"))) {
      const href = anchor.getAttribute("href");
      if (!href || !LINK_CONTEXT.test(`${anchor.textContent || ""} ${href}`)) continue;
      try {
        const url = new URL(href);
        if (url.protocol === "https:" || url.protocol === "http:") {
          link = url.toString();
          break;
        }
      } catch { /* ignore malformed links */ }
    }
  }

  return { code, link };
}
