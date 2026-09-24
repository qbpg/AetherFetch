import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Copy, Paperclip } from "lucide-react";

const features = [
  { title: "Create an address", description: "Get a disposable email address and copy it when you need it." },
  { title: "Read incoming mail", description: "Check messages, open verification links and download attachments." },
  { title: "Keep accounts together", description: "Save addresses in this browser, add labels and switch between them." },
];

const questions = [
  { question: "What is AetherFetch?", answer: "A free interface for temporary email. Addresses and messages are provided by mail.tm." },
  { question: "Where are my saved accounts stored?", answer: "Saved addresses and credentials are stored in this browser. Clearing site data removes them." },
  { question: "Can I use it for important accounts?", answer: "Temporary email is best for short-term use. Message retention and availability depend on mail.tm." },
];

export default function LandingContent() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-zinc-100">
      <main>
        <section className="border-b border-zinc-800 px-5 pb-20 pt-28 sm:pb-24 sm:pt-36">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div>
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Temporary email</p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
                A temporary inbox, ready when you need it.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400">
                Create an address, receive your message and get back to what you were doing. AetherFetch keeps your temporary inboxes in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white">
                  Create an address <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex h-11 items-center rounded-lg border border-zinc-700 px-5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800">
                  Open an existing inbox
                </Link>
              </div>
              <p className="mt-5 text-xs text-zinc-500">Free to use. Email service provided by mail.tm.</p>
            </div>
            <div aria-label="Example inbox" className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/20">
              <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
                <Mail className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium">Inbox</span>
                <span className="ml-auto rounded-md border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-400">example@domain.com</span>
              </div>
              <div className="border-b border-zinc-800 bg-zinc-800/40 px-5 py-4">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-zinc-200">Your verification code</span>
                  <span className="text-zinc-500">Just now</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">A new message has arrived.</p>
              </div>
              <div className="p-5">
                <p className="text-xs text-zinc-500">Verification code</p>
                <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3">
                  <span className="font-mono text-xl tracking-[0.18em]">482 931</span>
                  <Copy className="h-4 w-4 text-zinc-500" />
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><Paperclip className="h-3.5 w-3.5" /> Messages and attachments in one inbox.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">What you can do</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="border-t border-zinc-700 pt-5">
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-zinc-800 px-5 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">Good to know</h2>
            <div className="mt-8 max-w-3xl divide-y divide-zinc-800 border-t border-zinc-800">
              {questions.map((item) => (
                <div key={item.question} className="py-5">
                  <h3 className="text-sm font-medium">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-zinc-800 px-5 py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Ready to use a temporary address?</h2>
              <p className="mt-2 text-sm text-zinc-400">Create one now and check your inbox here. Need help? <a href="mailto:qbpg.sg@outlook.com" className="text-zinc-200 underline underline-offset-4 hover:text-white">Contact support</a>.</p>
            </div>
            <Link href="/register" className="inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 hover:bg-white">
              Create an address <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-5 py-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-300">
            <Image src="/logo.svg" alt="" width={20} height={20} />
            <span className="font-medium">AetherFetch</span>
          </div>
          <span>Created by qbpg</span>
          <Link href="/docs" className="hover:text-zinc-200">User Guide</Link>
          <Link href="/fr" lang="fr" className="hover:text-zinc-200">Français</Link>
          <Link href="/legal" className="hover:text-zinc-200">Legal Notice</Link>
          <Link href="/privacy" className="hover:text-zinc-200">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-200">Terms of Service</Link>
          <Link href="/refund" className="hover:text-zinc-200">Refund Policy</Link>
          <a href="mailto:qbpg.sg@outlook.com" className="hover:text-zinc-200">qbpg.sg@outlook.com</a>
        </div>
      </footer>
    </div>
  );
}
