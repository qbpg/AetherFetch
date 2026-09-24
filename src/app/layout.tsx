import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "@/contexts/SessionContext";
import AppShell from "@/components/AppShell";
import CookieConsent from "@/components/CookieConsent";

const SITE_URL = "https://aetherfetch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AetherFetch — Free Temporary Email",
  description:
    "Create a free temporary email address with AetherFetch. Receive verification emails, read messages and manage disposable inboxes in one place.",
  robots: { index: true, follow: true },
  applicationName: "AetherFetch",
  alternates: { canonical: "/", languages: { en: "/", fr: "/fr", "x-default": "/" } },
  openGraph: {
    title: "AetherFetch — Free Temporary Email",
    description:
      "Create a free temporary email address with AetherFetch. Receive verification emails and manage disposable inboxes in one place.",
    url: SITE_URL,
    siteName: "AetherFetch",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "AetherFetch — Free Temporary Email",
    description: "Create a free temporary email address and keep verification messages in one place.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} translate="no">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <meta name="google-site-verification" content="SxrUNkyvIqXp3QQLSjsYbPZa5EWW1SgbHQiYqZKgpbg" />
      </head>
      <body className="h-full antialiased">
        <SessionProvider>
          <AppShell>
            {children}
          </AppShell>
          <CookieConsent />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
