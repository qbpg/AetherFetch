"use client";

import Link from "next/link";
import {
  Mail, Shield, Zap, Clock, Globe, ArrowRight,
  Inbox, Eye, Copy, RefreshCw, Terminal,
  Lock, Trash2, UserX, TestTube, Code2, ShieldCheck,
} from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Access", desc: "Generate a temporary email address in seconds. No signup, no commitment, no trace." },
  { icon: Shield, title: "Privacy First", desc: "Your real inbox stays untouched. All data lives in your browser, nothing stored server-side." },
  { icon: Clock, title: "Auto-Refresh", desc: "Live Mercure SSE connection delivers messages in real-time. Fallback polling every 30s." },
  { icon: Globe, title: "Multiple Domains", desc: "Choose from available domains. Create and manage multiple accounts effortlessly." },
];

const STEPS = [
  { num: "01", icon: Terminal, title: "Generate or Login", desc: "Create a new temporary address or sign into an existing one with a single click." },
  { num: "02", icon: Inbox, title: "Receive Messages", desc: "Share your new address. Emails arrive instantly in your AetherFetch inbox." },
  { num: "03", icon: Eye, title: "Read & Manage", desc: "View, search, copy, and delete messages. Full control over your temporary mailbox." },
];

const USE_CASES = [
  { icon: UserX, title: "Avoid Spam", desc: "Sign up for services without exposing your real email to spam lists." },
  { icon: TestTube, title: "Dev Testing", desc: "Quick test accounts and email verification flows without burning real inboxes." },
  { icon: Code2, title: "API & Scripts", desc: "Automate workflows that need disposable addresses for webhook callbacks." },
  { icon: Lock, title: "Anonymity", desc: "Browse, register, and interact online without leaving a permanent identity trail." },
];

const FAQ_ITEMS = [
  { q: "What is AetherFetch?", a: "AetherFetch is a temporary email service that lets you create disposable email addresses for quick signups, verifications, and privacy protection. No personal data required." },
  { q: "Are my messages stored on a server?", a: "No. Your session data and messages are stored locally in your browser via localStorage. Nothing is persisted on our servers beyond what the mail.tm API requires for delivery." },
  { q: "How long do messages stay?", a: "Messages persist as long as your session is active. When you clear your browser data or your session expires, the mailbox and all messages are gone." },
  { q: "Can I use this for production email?", a: "No. AetherFetch is designed for temporary, disposable use. Do not rely on it for important or long-term communication." },
];

export default function LandingContent() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="absolute inset-0 bg-[#09090b]/60" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-full text-xs text-zinc-400 mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            Temporary email, zero footprint
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Your inbox.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Ephemeral by design.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Generate disposable email addresses instantly. Protect your real inbox
            from spam, trackers, and unwanted signups. No account needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/register"
              className="group h-11 px-7 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="h-11 px-7 flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all duration-200 backdrop-blur"
            >
              I have an account
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-xs text-zinc-600 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              <span>No tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Live updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-zinc-800/50 bg-zinc-900/30 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "< 3s", label: "Email creation" },
            { value: "0", label: "Data stored on servers" },
            { value: "100%", label: "Browser-side" },
            { value: "Free", label: "Forever" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Everything you need,
              <span className="text-zinc-500"> nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-4 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300">
                    <f.icon className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 px-4 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Three steps.
              <span className="text-zinc-500"> Zero friction.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-10 left-[calc(100%+8px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-zinc-800 to-transparent z-0" />
                )}
                <div className="relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                      {s.num}
                    </span>
                    <s.icon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-28 px-4 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-3">Use Cases</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              One address.
              <span className="text-zinc-500"> Endless scenarios.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="group p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
              >
                <uc.icon className="w-5 h-5 text-indigo-400/70 group-hover:text-indigo-400 transition-colors mb-3" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">{uc.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inbox preview */}
      <section className="py-20 sm:py-28 px-4 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-3">Clean Interface</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Crafted for clarity.
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] text-zinc-600 font-mono">AetherFetch Dashboard</span>
              </div>
            </div>
            <div className="flex min-h-[320px]">
              <div className="w-64 border-r border-zinc-800 p-3 space-y-1 hidden sm:block">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs text-zinc-300">Inbox</span>
                  <span className="ml-auto text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">3</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] text-zinc-500">{["N", "G", "S"][i - 1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-zinc-300 truncate">{["Netflix", "GitHub", "Stripe"][i - 1]}</p>
                      <p className="text-[9px] text-zinc-600 truncate">{["Verify your email", "Welcome to GitHub", "Payment receipt"][i - 1]}</p>
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
                    <p className="text-xs text-zinc-300 font-medium">Netflix</p>
                    <p className="text-[10px] text-zinc-600">noreply@netflix.com</p>
                  </div>
                  <span className="ml-auto text-[10px] text-zinc-600">2m ago</span>
                </div>
                <div className="flex-1 bg-zinc-800/30 rounded-lg p-4 border border-zinc-800/50">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Welcome to Netflix! Your account has been created. Please verify
                    your email address to start watching.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="h-7 px-3 text-[10px] font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-md flex items-center gap-1">
                    <Copy className="w-2.5 h-2.5" /> Copy
                  </button>
                  <button className="h-7 px-3 text-[10px] font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-md flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5" /> Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 sm:py-28 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-indigo-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight mb-3">
                  Security baked in, not bolted on.
                </h2>
                <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                    <p>Sessions are stored exclusively in your browser. No server-side accounts, no tracking cookies.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                    <p>Everything vanishes when you close your browser or clear storage. Zero forensic footprint.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                    <p>Email content is sandboxed in a secure iframe. External links open safely in new tabs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 px-4 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-zinc-200 hover:text-zinc-100 transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-zinc-600 group-open:rotate-180 transition-transform duration-200">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-4 text-xs text-zinc-500 leading-relaxed border-t border-zinc-800/50 pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-20 sm:py-28 px-4 border-t border-zinc-800/50">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Mail className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mb-4">
            Ready to protect your inbox?
          </h2>
          <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
            Create your first temporary email in seconds. No account required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="group h-11 px-7 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="mailto:qbpg.sg@outlook.com"
              className="h-11 px-7 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Contact support
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="AetherFetch" className="h-5 w-5 object-contain" />
            <span className="text-xs font-semibold text-zinc-400">AetherFetch</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>Created by qpbg</span>
            <a href="mailto:qbpg.sg@outlook.com" translate="no" className="hover:text-zinc-400 transition-colors">
              qbpg.sg@outlook.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
