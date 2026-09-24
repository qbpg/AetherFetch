"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Mail, ShieldCheck, Sparkles, Zap, Paperclip, KeyRound } from "lucide-react";

const FEATURES = [
  { title: "Instant addresses", desc: "Create and copy a fresh address in one step. Add a label when you need to recognize it later." },
  { title: "Codes at a glance", desc: "Verification codes and confirmation links are pulled out of messages for quick access." },
  { title: "Complete inbox", desc: "Browse older pages, search messages, and download attachments from one focused workspace." },
  { title: "Live when available", desc: "Authenticated live updates keep the inbox fresh, with polling when the connection drops." },
];

const STEPS = [
  { num: "01", title: "Generate or sign in", desc: "Create a new address or log into a saved one in a single click." },
  { num: "02", title: "Receive messages", desc: "Share the address. Mail lands in the inbox as soon as it is delivered." },
  { num: "03", title: "Read and manage", desc: "View, filter, copy, and delete messages on your terms." },
];

const FAQ_ITEMS = [
  { q: "What is AetherFetch?", a: "A temporary email service for disposable addresses. Quick signups, verifications, and privacy protection. No personal data required." },
  { q: "Where are my messages stored?", a: "Messages are held by mail.tm and fetched when you open your inbox. AetherFetch stores your session and saved account credentials in this browser." },
  { q: "How long do messages stay?", a: "Retention is controlled by mail.tm. Temporary addresses are not suitable for long-term storage." },
  { q: "Can I use this for production email?", a: "No. AetherFetch is for temporary, disposable use. Do not rely on it for important or long-term communication." },
];

const NUMBERS = [
  { value: "01", label: "Create an address" },
  { value: "02", label: "Receive a message" },
  { value: "03", label: "Copy your code" },
  { value: "∞", label: "Less inbox clutter" },
];

const CODE_SNIPPET = `1. Create an address
2. Use it where you need a verification email
3. Copy the code from your inbox`;

export default function LandingContent() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <section className="landing-hero relative min-h-[100dvh] overflow-hidden flex items-center px-5 pt-28 pb-20 sm:pt-32">
        <div className="landing-orb landing-orb-one" aria-hidden="true" />
        <div className="landing-orb landing-orb-two" aria-hidden="true" />
        <div className="relative z-10 max-w-6xl w-full mx-auto grid lg:grid-cols-[1fr_0.9fr] items-center gap-16 lg:gap-10">
          <div className="landing-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs text-indigo-200 mb-7">
              <Sparkles className="w-3.5 h-3.5" /> A calmer way to use temporary email
            </div>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-[-0.055em] text-zinc-50 leading-[1.05] mb-7">
              Email for the moment.<br /><span className="landing-gradient-text">Clarity for everything else.</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mb-9 leading-relaxed">
              Create a fresh address, catch the message, copy the code, and move on. Your everyday inbox stays yours.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/register"
              className="landing-primary h-12 px-6 flex items-center gap-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold rounded-xl transition-all"
            >
              Get a new address
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="h-12 px-6 flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800/60 border border-zinc-700 rounded-xl transition-colors"
            >
              Open my inbox
            </Link>
          </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-indigo-300" /> Fast setup</span>
              <span className="inline-flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-indigo-300" /> Easy verification</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-300" /> Disposable by design</span>
            </div>
          </div>
          <div className="landing-preview relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[32px] bg-indigo-500/10 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-2xl border border-zinc-700/80 bg-[#121218]/95 shadow-[0_32px_100px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800/80">
                <div className="w-2 h-2 rounded-full bg-indigo-300 shadow-[0_0_12px_#a5b4fc]" />
                <span className="text-xs font-medium text-zinc-300">AetherFetch</span>
                <span className="ml-auto text-[10px] text-zinc-500 font-mono">LIVE INBOX</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center"><Mail className="w-4 h-4 text-indigo-300" /></div>
                  <div><p className="text-xs text-zinc-200 font-medium">Welcome to your new inbox</p><p className="text-[11px] text-zinc-500">A message just arrived</p></div>
                  <span className="ml-auto w-2 h-2 rounded-full bg-indigo-300" />
                </div>
                <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4 mb-4">
                  <div className="text-[10px] text-indigo-300 uppercase tracking-[0.18em] mb-2">Verification code</div>
                  <div className="flex items-center justify-between"><span className="text-3xl tracking-[0.2em] text-white font-mono">482 931</span><span className="text-[10px] rounded-md bg-indigo-300 text-zinc-950 px-2 py-1 font-semibold">COPY</span></div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2.5 text-xs text-zinc-400"><Paperclip className="w-3.5 h-3.5" /> Your messages, codes and files together</div>
              </div>
            </div>
            <div className="landing-float absolute -bottom-5 -left-5 sm:-left-9 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl text-[11px] text-zinc-300"><span className="text-indigo-300">●</span> Address ready to use</div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {NUMBERS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight">{s.value}</p>
              <p className="text-xs text-zinc-400 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">Features</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
              What it does.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="py-5 border-t border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-50 mb-1.5 tracking-tight">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
              Three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
                <span className="block text-[10px] font-bold text-zinc-500 font-mono mb-4">
                  {s.num}
                </span>
                <h3 className="text-sm font-semibold text-zinc-50 mb-1.5 tracking-tight">{s.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section className="py-24 sm:py-32 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-10 items-center">
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">Developers</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight mb-4">
                Simple from the start.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                An address, a message, a verification code. The essentials stay close at hand.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center text-sm font-medium text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 border border-zinc-800 rounded-lg px-4 py-2 transition-colors"
              >
                Try it now
              </Link>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                  <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-mono">your flow</span>
                </div>
                <pre className="p-4 text-xs text-zinc-400 font-mono leading-relaxed overflow-x-auto">
                  <code>{CODE_SNIPPET}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inbox preview */}
      <section className="py-24 sm:py-32 px-4 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">Interface</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
              The inbox, nothing else.
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] text-zinc-500 font-mono">AetherFetch Dashboard</span>
              </div>
            </div>
            <div className="flex min-h-[320px]">
              <div className="w-64 border-r border-zinc-800 p-3 space-y-1 hidden sm:block">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-md">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-200">Inbox</span>
                  <span className="ml-auto text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded-full">3</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800/50 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] text-zinc-400">{["N", "G", "S"][i - 1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-zinc-300 truncate">{["Netflix", "GitHub", "Stripe"][i - 1]}</p>
                      <p className="text-[9px] text-zinc-500 truncate">{["Verify your email", "Welcome to GitHub", "Payment receipt"][i - 1]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-xs text-zinc-400">N</span>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-200 font-medium">Netflix</p>
                    <p className="text-[10px] text-zinc-500">noreply@netflix.com</p>
                  </div>
                  <span className="ml-auto text-[10px] text-zinc-500">2m ago</span>
                </div>
                <div className="flex-1 bg-zinc-800/50 rounded-md p-4 border border-zinc-800">
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Welcome to Netflix! Your account has been created. Please verify
                    your email address to start watching.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 sm:py-32 px-4 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 font-mono">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-200 hover:text-zinc-50 transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-zinc-500 group-open:rotate-180 transition-transform duration-200">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 sm:py-32 px-4 border-t border-zinc-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight mb-4">
            Create a temporary address.
          </h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto">
            No account required to start. The address works the moment it is generated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="h-12 px-8 flex items-center gap-2.5 bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold rounded-lg transition-colors"
            >
              Create an address
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:qbpg.sg@outlook.com"
              className="h-12 px-8 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            >
              Contact support
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="AetherFetch" width={20} height={20} className="h-5 w-5 object-contain" />
            <span className="text-xs font-semibold text-zinc-400">AetherFetch</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>Created by qbpg</span>
            <Link href="/legal" className="hover:text-zinc-300 transition-colors">Legal Notice</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <Link href="/refund" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
            <a href="https://mail.tm" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Powered by mail.tm</a>
            <a href="mailto:qbpg.sg@outlook.com" translate="no" className="hover:text-zinc-300 transition-colors">
              qbpg.sg@outlook.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
