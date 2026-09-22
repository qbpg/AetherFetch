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
  title: "AetherFetch - Temporary Email",
  description:
    "Temporary email panel: create a disposable inbox, receive messages in real time, and manage multiple mail.tm accounts from a single interface.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "AetherFetch - Temporary Email",
    description:
      "Temporary email panel: create a disposable inbox, receive messages in real time, and manage multiple mail.tm accounts from a single interface.",
    url: SITE_URL,
    siteName: "AetherFetch",
    type: "website",
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
