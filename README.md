<p align="center">
  <img src="public/logo.svg" alt="AetherFetch" width="56" />
</p>

<h1 align="center">AetherFetch <span style="font-size: 0.6em; color: #71717a;">(AF)</span></h1>

<p align="center">
  Temporary email panel — instant access, zero friction.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-18181b?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-18181b?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-18181b?style=flat-square&logo=typescript&logoColor=3178C6" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-18181b?style=flat-square&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Proxy-Cloudflare_Worker-18181b?style=flat-square&logo=cloudflare&logoColor=F6821F" alt="Cloudflare Worker Proxy" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-18181b?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-18181b?style=flat-square" alt="MIT License" />
</p>

---

## Overview

**AetherFetch (AF)** is a high-precision temporary email management panel built with a minimal zinc monochrome design. It provides instant disposable email access via the [mail.tm](https://mail.tm) API, routed through a Cloudflare Worker CORS proxy for zero-friction anti-bot protection.

Multi-account management, real-time inbox with Mercure SSE, keyboard shortcuts, and a silent anti-bot layer — all in a clean, dark interface with surgical attention to detail.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Fonts | Geist Sans + Geist Mono |
| API | [mail.tm](https://mail.tm) (temporary email) |
| Realtime | Mercure SSE (`mercure.mail.tm`) |
| Proxy | Cloudflare Worker (CORS) |
| Deploy | Vercel |

## Features

- **Intelligent onboarding** — Register or login with one click, random credential generator
- **Quick connect** — Saved accounts with favorites, archiving, and custom labels
- **Synchronized deletion** — Account removal stays in sync across profile and quick-connect
- **Real-time inbox** — Mercure SSE for live updates with 30s polling fallback
- **Secure mail reader** — Sandboxed iframe (`allow-same-origin` only) for rendering HTML emails
- **Full-text search** — Filter messages by sender, subject, or content
- **Keyboard shortcuts** — `C` to copy email, `R` to refresh (with micro-animation feedback)
- **Toast notifications** — Success, error, and info feedback with animated transitions
- **Silent anti-bot** — Honeypot field + minimum submission time (no CAPTCHA)
- **Mobile responsive** — Adaptive layout with inbox/detail view toggle
- **Legal compliance** — Footer with mentions légales and privacy policy modals

## Getting Started

```bash
# Clone
git clone https://github.com/qbpg/AetherFetch.git
cd AetherFetch

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  app/
    page.tsx                 # Root redirect → /home
    layout.tsx               # Root layout (SessionProvider, Header, Toasts)
    globals.css              # Tailwind + custom animations
    api/mailbox/[...path]/   # Catch-all API proxy → Cloudflare Worker
    home/page.tsx            # Home / session selector
    dashboard/page.tsx       # Inbox + mail reader
    accounts/page.tsx        # Multi-account management
    login/page.tsx           # Login view
    register/page.tsx        # Register view
  components/
    AuthForm.tsx             # Login / Register form + quick connect
    Footer.tsx               # Footer with legal modals
    SecureMailIframe.tsx     # Sandboxed HTML email renderer
    SessionSelector.tsx      # Active session / new mailbox picker
  contexts/
    SessionContext.tsx        # Global session + messages + SSE state
  lib/
    mailbox.ts               # API client + localStorage persistence
    types.ts                 # TypeScript interfaces
cf-proxy/
  index.js                   # Cloudflare Worker (CORS proxy to mail.tm)
  wrangler.toml              # Worker configuration
```

## Architecture

```
Browser (Next.js 16 + React 19)
  │
  ├─ /api/mailbox/*  ──────────── Next.js catch-all route
  │     │
  │     └─────────────────────── Cloudflare Worker (CORS proxy)
  │                                │
  │                                └── api.mail.tm (email API)
  │
  └─ Mercure SSE ─────────────── mercure.mail.tm (realtime updates)
```

**Request flow:** Client → `/api/mailbox/*` → Next.js route handler → Cloudflare Worker → `api.mail.tm`

The Cloudflare Worker injects browser-like headers (`User-Agent`, `Sec-Fetch-*`) to bypass anti-bot checks at the API level. Rate limiting (429) is handled client-side with exponential backoff.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `C` | Copy current email address to clipboard |
| `R` | Refresh inbox messages |

Shortcuts are disabled when an input or textarea is focused. Visual feedback is provided via a floating HUD with micro-animations.

## Deploy

```bash
# Vercel
npx vercel --prod

# Cloudflare Worker
cd cf-proxy && npx wrangler deploy
```

**Production:** [https://aetherfetch.vercel.app](https://aetherfetch.vercel.app)

## Environment Variables

The application requires no client-side environment variables. The Cloudflare Worker uses `MAIL_TM_BASE` as a binding.

## License

[MIT](LICENSE) — Copyright (c) 2026 QPBG

## Author

**qbpg** — [qbpg.sg@outlook.com](mailto:qbpg.sg@outlook.com)

GitHub: [github.com/qbpg](https://github.com/qbpg)
