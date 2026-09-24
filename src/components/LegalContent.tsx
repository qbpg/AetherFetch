import type { ReactNode } from "react";
import Link from "next/link";

export const legalPages = {
  legal: { title: "Legal Notice", route: "/legal" },
  privacy: { title: "Privacy Policy", route: "/privacy" },
  terms: { title: "Terms of Service", route: "/terms" },
  refund: { title: "Refund Policy", route: "/refund" },
} as const;

export type LegalPage = keyof typeof legalPages;

export default function LegalContent({ page }: { page: LegalPage }) {
  let content: ReactNode;
  switch (page) {
    case "legal":
      content = (
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
      );
      break;
    case "privacy":
      content = (
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
      );
      break;
    case "terms":
      content = (
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
      );
      break;
    case "refund":
      content = (
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
      );
      break;
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <Link href="/home" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">← Back to home</Link>
        <h1 className="mt-8 mb-8 text-3xl font-semibold tracking-tight text-zinc-100">{legalPages[page].title}</h1>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-400">{content}</div>
        <nav aria-label="Policies" className="mt-12 border-t border-zinc-800 pt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs">
          <Link href="/legal" className="text-zinc-500 hover:text-zinc-200 transition-colors">Legal Notice</Link>
          <Link href="/privacy" className="text-zinc-500 hover:text-zinc-200 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-zinc-500 hover:text-zinc-200 transition-colors">Terms of Service</Link>
          <Link href="/refund" className="text-zinc-500 hover:text-zinc-200 transition-colors">Refund Policy</Link>
        </nav>
      </article>
    </main>
  );
}
