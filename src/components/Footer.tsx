"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

type Modal = "legal" | "privacy" | "terms" | "refund" | null;

export default function Footer() {
  const [modal, setModal] = useState<Modal>(null);

  const close = useCallback(() => setModal(null), []);

  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>("[data-modal='privacy']");
    if (!trigger) return;
    const handler = () => setModal("privacy");
    trigger.addEventListener("click", handler);
    return () => trigger.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modal, close]);

  function titleFor(m: Modal) {
    switch (m) {
      case "legal": return "Legal Notice";
      case "privacy": return "Privacy Policy";
      case "terms": return "Terms of Service";
      case "refund": return "Refund Policy";
      default: return "";
    }
  }

  return (
    <>
      <footer className="flex-shrink-0 border-t border-zinc-800 mt-8 pt-6 pb-4 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-zinc-500">
        <span>Created by qpbg</span>
        <span className="text-zinc-700">·</span>
        <a href="mailto:qbpg.sg@outlook.com" translate="no" className="hover:text-zinc-300 transition-colors">
          qbpg.sg@outlook.com
        </a>
        <span className="text-zinc-700">·</span>
        <button onClick={() => setModal("legal")} className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">
          Legal Notice
        </button>
        <span className="text-zinc-700">·</span>
        <button onClick={() => setModal("privacy")} className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">
          Privacy Policy
        </button>
        <span className="text-zinc-700">·</span>
        <button onClick={() => setModal("terms")} className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">
          Terms of Service
        </button>
        <span className="text-zinc-700">·</span>
        <button onClick={() => setModal("refund")} className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">
          Refund Policy
        </button>
      </footer>

      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="w-full max-w-lg max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 animate-fade-in-up flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
              <h3 className="text-base font-semibold text-zinc-100">{titleFor(modal)}</h3>
              <button onClick={close}
                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-5 text-sm text-zinc-400 leading-relaxed space-y-3 overflow-y-auto">
              {modal === "legal" && (
                <>
                  <p><span className="text-zinc-300 font-medium">Publisher:</span> qbpg</p>
                  <p><span className="text-zinc-300 font-medium">Support Contact:</span>{" "}
                    <a href="mailto:qbpg.sg@outlook.com" translate="no" className="text-zinc-300 hover:text-zinc-50 transition-colors underline underline-offset-2">
                      qbpg.sg@outlook.com
                    </a>
                  </p>
                  <p>
                    This service is a temporary messaging tool provided for informational purposes.
                    No guarantee of long-term message retention is offered.
                  </p>
                </>
              )}
              {modal === "privacy" && (
                <>
                  <p><span className="text-zinc-300 font-medium">Data Controller:</span> qbpg</p>
                  <p><span className="text-zinc-300 font-medium">Contact:</span>{" "}
                    <a href="mailto:qbpg.sg@outlook.com" translate="no" className="text-zinc-300 hover:text-zinc-50 transition-colors underline underline-offset-2">
                      qbpg.sg@outlook.com
                    </a>
                  </p>
                  <p>
                    <span className="text-zinc-300 font-medium">Information We Collect.</span>{" "}
                    AetherFetch operates as a temporary email interface. We do not collect personal information beyond what you
                    voluntarily provide. Session data (email address and token) is stored exclusively in your browser&apos;s local storage
                    and is never transmitted to our servers or any third party.
                  </p>
                  <p>
                    <span className="text-zinc-300 font-medium">Cookies &amp; Local Storage.</span>{" "}
                    We use browser local storage solely to maintain your active session and remember your cookie consent preference.
                    No third-party tracking cookies are used. Analytics data is collected anonymously via Vercel Analytics.
                  </p>
                  <p>
                    <span className="text-zinc-300 font-medium">Data Retention.</span>{" "}
                    All message data is temporary and may be purged at any time without notice. No guarantee of long-term
                    retention is offered.
                  </p>
                  <p>
                    <span className="text-zinc-300 font-medium">Your Rights (GDPR / CCPA).</span>{" "}
                    You have the right to access, rectify, or delete your data at any time. Since all data is stored locally in
                    your browser, you can clear it at any time via your browser settings or by using the account management panel.
                    You may also reject analytics tracking at any time.
                  </p>
                  <p>
                    <span className="text-zinc-300 font-medium">Changes.</span>{" "}
                    This policy may be updated periodically. Continued use of the service after changes constitutes acceptance.
                  </p>
                </>
              )}
              {modal === "terms" && (
                <>
                  <p><span className="text-zinc-300 font-medium">1. Acceptance of Terms.</span>{" "}
                    By accessing or using AetherFetch (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                    If you do not agree, do not use the Service.
                  </p>
                  <p><span className="text-zinc-300 font-medium">2. Description of Service.</span>{" "}
                    AetherFetch is a free, temporary email interface that allows users to receive and view messages through
                    third-party temporary email providers. The Service does not guarantee delivery, retention, or availability
                    of any messages.
                  </p>
                  <p><span className="text-zinc-300 font-medium">3. User Responsibilities.</span>{" "}
                    You are responsible for maintaining the confidentiality of your session credentials. You agree not to use
                    the Service for any unlawful purpose, including but not limited to spam, fraud, or harassment.
                  </p>
                  <p><span className="text-zinc-300 font-medium">4. Intellectual Property.</span>{" "}
                    All content, code, and design elements of the Service are the property of qbpg and are protected by
                    applicable intellectual property laws.
                  </p>
                  <p><span className="text-zinc-300 font-medium">5. Disclaimer of Warranties.</span>{" "}
                    The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether
                    express or implied. We do not warrant that the Service will be uninterrupted, error-free, or secure.
                  </p>
                  <p><span className="text-zinc-300 font-medium">6. Limitation of Liability.</span>{" "}
                    In no event shall qbpg be liable for any indirect, incidental, special, or consequential damages arising
                    out of or related to your use of the Service.
                  </p>
                  <p><span className="text-zinc-300 font-medium">7. Termination.</span>{" "}
                    We reserve the right to suspend or terminate access to the Service at any time, without prior notice,
                    for any reason.
                  </p>
                  <p><span className="text-zinc-300 font-medium">8. Governing Law.</span>{" "}
                    These Terms are governed by the laws of the European Union and applicable international regulations.
                  </p>
                </>
              )}
              {modal === "refund" && (
                <>
                  <p><span className="text-zinc-300 font-medium">1. Free Service.</span>{" "}
                    AetherFetch is a free service provided at no cost to the user. No payments, subscriptions, or financial
                    transactions are required or processed through the Service.
                  </p>
                  <p><span className="text-zinc-300 font-medium">2. No Refunds.</span>{" "}
                    As the Service is provided entirely free of charge, there are no refunds to process. No financial data
                    is collected, stored, or processed by AetherFetch.
                  </p>
                  <p><span className="text-zinc-300 font-medium">3. Third-Party Services.</span>{" "}
                    AetherFetch interfaces with third-party temporary email providers. Any costs or terms associated with
                    those providers are governed by their own policies and are outside the scope of this Refund Policy.
                  </p>
                  <p><span className="text-zinc-300 font-medium">4. Changes to This Policy.</span>{" "}
                    We reserve the right to update this policy at any time. Changes will be reflected on this page.
                  </p>
                </>
              )}
            </div>
            <div className="px-5 py-4 border-t border-zinc-800 flex justify-end shrink-0">
              <button onClick={close}
                className="h-8 px-4 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
