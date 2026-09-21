"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mail, Shield, Zap, Clock, Globe, ArrowRight,
  Inbox, Eye, Terminal, ArrowUpRight, Code2,
} from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Access", desc: "Generate a temporary email in seconds. No signup, no commitment, no trace." },
  { icon: Shield, title: "Privacy First", desc: "Your real inbox stays untouched. All data lives in your browser, nothing stored server-side." },
  { icon: Clock, title: "Auto-Refresh", desc: "Live SSE connection delivers messages in real-time. Fallback polling every 30s." },
  { icon: Globe, title: "Multiple Domains", desc: "Choose from available domains. Create and manage multiple accounts effortlessly." },
];

const STEPS = [
  { num: "01", icon: Terminal, title: "Generate or Login", desc: "Create a new address or sign into an existing one in one click." },
  { num: "02", icon: Inbox, title: "Receive Messages", desc: "Share your address. Emails arrive instantly in your inbox." },
  { num: "03", icon: Eye, title: "Read & Manage", desc: "View, search, copy, and delete messages on your terms." },
];

const FAQ_ITEMS = [
  { q: "What is AetherFetch?", a: "A temporary email service for disposable addresses. Quick signups, verifications, and privacy protection. No personal data required." },
  { q: "Are my messages stored on a server?", a: "No. Your session and messages are stored locally in your browser via localStorage. Nothing is persisted on our servers." },
  { q: "How long do messages stay?", a: "As long as your session is active. Clear your browser data or let the session expire, and everything is gone." },
  { q: "Can I use this for production email?", a: "No. AetherFetch is for temporary, disposable use. Do not rely on it for important or long-term communication." },
];

const NUMBERS = [
  { value: "< 3s", label: "Email creation" },
  { value: "0", label: "Server-side data" },
  { value: "100%", label: "Client-side" },
  { value: "Free", label: "Forever" },
];

const CODE_SNIPPET = `// Generate a temp email in 3 lines
const email = await createAccount(
  "user@uberip.com", password
);
// Done. Start receiving mail.`;

export default function LandingContent() {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = sectionsRef.current?.querySelectorAll(".reveal");
    if (!sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionsRef} className="flex-1 overflow-y-auto">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center px-4 pt-20 pb-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-100/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-500 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            Temporary email, zero footprint
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.05] mb-6">
            Your inbox.
            <br />
            <span className="text-zinc-500">Ephemeral.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-lg mx-auto mb-12 leading-relaxed">
            Disposable email addresses in seconds.
            <br className="hidden sm:block" />
            Protect your real inbox from spam and trackers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group h-12 px-8 flex items-center gap-2.5 bg-white hover:bg-zinc-200 text-zinc-900 text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.06)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="h-12 px-8 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-200"
            >
              I have an account
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              <span>No tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-zinc-500" />
              <span>Instant setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span>Live updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {NUMBERS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-14">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Everything you need,
              <span className="text-zinc-500"> nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="reveal p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors duration-200"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center mb-4">
                  <f.icon className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-14">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Three steps.
              <span className="text-zinc-500"> Zero friction.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="reveal relative" style={{ transitionDelay: `${i * 100}ms` }}>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-10 left-[calc(100%+8px)] w-[calc(100%-80px)] h-px bg-zinc-800/80 z-0" />
                )}
                <div className="relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full font-mono">
                      {s.num}
                    </span>
                    <s.icon className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section className="py-24 sm:py-32 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="reveal flex flex-col sm:flex-row gap-10 items-center">
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Developers</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mb-4">
                Simple by design.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                A clean API, no dependencies, no complexity. Create an account, get a token, receive mail. That&apos;s it.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
              >
                Try it now
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                  <Code2 className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] text-zinc-600 font-mono">example.js</span>
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
      <section className="py-24 sm:py-32 px-4 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-10">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Interface</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Crafted for clarity.
            </h2>
          </div>

          <div className="reveal bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
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
                  <span className="ml-auto text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">3</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 sm:py-32 px-4 border-t border-zinc-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="reveal mb-12">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                className="reveal group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                style={{ transitionDelay: `${i * 60}ms` }}
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

      {/* CTA */}
      <section id="contact" className="py-24 sm:py-32 px-4 border-t border-zinc-800/50">
        <div className="reveal max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mb-4">
            Ready to protect your inbox?
          </h2>
          <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
            Create your first temporary email in seconds. No account required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group h-12 px-8 flex items-center gap-2.5 bg-white hover:bg-zinc-200 text-zinc-900 text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.06)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="mailto:qbpg.sg@outlook.com"
              className="h-12 px-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-200"
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
