import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Copy, Inbox, Mail, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "User Guide | AetherFetch",
  description: "A step-by-step guide to creating a temporary email address, opening your inbox and managing accounts with AetherFetch.",
  alternates: { canonical: "/docs" },
};

const steps = [
  {
    number: "01",
    title: "Start on the home page",
    description: "Choose Create an address for a new inbox, or Open an existing inbox if you already have an address.",
    image: "/docs/home.jpg",
    alt: "AetherFetch home page with Create an address and Open an existing inbox buttons",
  },
  {
    number: "02",
    title: "Create an address",
    description: "On the Register screen, enter a username and select an available domain. Set a password and, if you want, a label. You can also use Generate random credentials. Then select Create account.",
    image: "/docs/register.jpg",
    alt: "AetherFetch Register screen showing the username, domain, password and Create account controls",
  },
  {
    number: "03",
    title: "Sign in later",
    description: "Use the full email address and its password on the Login screen to reopen an existing inbox. Keep these details somewhere safe if you need the address again.",
    image: "/docs/login.jpg",
    alt: "AetherFetch Login screen with fields for the full email address and password",
  },
];

export default function DocsPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-[#09090b] px-5 py-12 text-zinc-100 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-12 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-200">AetherFetch</Link>
          <span>/</span>
          <span className="text-zinc-200">User guide</span>
        </nav>
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Documentation</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">How to use AetherFetch</h1>
          <p className="mt-5 text-base leading-7 text-zinc-400">Create an address, check your inbox and return to it later. This guide follows the current AetherFetch interface.</p>
          <Link href="/register" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-white">Get an address <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-16 space-y-20">
          {steps.map((step) => (
            <section key={step.number} className="border-t border-zinc-800 pt-8">
              <div className="grid gap-8 lg:grid-cols-[0.65fr_1fr] lg:items-start">
                <div>
                  <span className="font-mono text-xs text-zinc-500">{step.number}</span>
                  <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{step.description}</p>
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                  <Image src={step.image} alt={step.alt} width={1365} height={935} sizes="(max-width: 1024px) 100vw, 600px" className="h-auto w-full" />
                </div>
              </div>
            </section>
          ))}

          <section className="border-t border-zinc-800 pt-8">
            <span className="font-mono text-xs text-zinc-500">04</span>
            <h2 className="mt-2 text-xl font-semibold">Use the dashboard</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Once signed in, your email address appears at the top. Copy it and paste it wherever you want to receive a message. On mobile, use the visible Copy email button. Incoming messages appear in the inbox; select one to read it. Use Refresh if you are waiting for a message.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><Copy className="h-4 w-4 text-zinc-300" /><h3 className="mt-3 text-sm font-medium">Copy address</h3><p className="mt-1 text-xs leading-5 text-zinc-400">Tap Copy email, or press C on desktop.</p></div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><Inbox className="h-4 w-4 text-zinc-300" /><h3 className="mt-3 text-sm font-medium">Read messages</h3><p className="mt-1 text-xs leading-5 text-zinc-400">Open a message to view its contents and verification code.</p></div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><RefreshCw className="h-4 w-4 text-zinc-300" /><h3 className="mt-3 text-sm font-medium">Refresh inbox</h3><p className="mt-1 text-xs leading-5 text-zinc-400">Refresh manually if a message has not arrived yet.</p></div>
            </div>
          </section>

          <section className="border-t border-zinc-800 pt-8">
            <span className="font-mono text-xs text-zinc-500">05</span>
            <h2 className="mt-2 text-xl font-semibold">Switch between accounts</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Open Accounts to see addresses saved in this browser. Select one to switch inboxes, use a label to recognize it later, or create another address from the dashboard.</p>
          </section>
        </div>

        <aside className="mt-16 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-sm leading-6 text-zinc-400">
          <div className="mb-2 flex items-center gap-2 text-zinc-100"><Mail className="h-4 w-4" /><h2 className="font-medium">Before you rely on an address</h2></div>
          AetherFetch currently uses mail.tm for email delivery. Saved account credentials remain in this browser, and clearing site data can remove them. Temporary addresses are unsuitable for important or long-term accounts.
        </aside>
        <footer className="mt-16 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-800 py-8 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-200">Back to AetherFetch</Link>
          <Link href="/privacy" className="hover:text-zinc-200">Privacy Policy</Link>
          <a href="mailto:qbpg.sg@outlook.com" className="hover:text-zinc-200">Contact</a>
          <span>Created by qbpg</span>
        </footer>
      </div>
    </main>
  );
}
