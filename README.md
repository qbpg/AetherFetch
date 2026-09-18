<p align="center">
  <img src="public/logo.svg" alt="Mailbox" width="64" />
</p>

<h1 align="center">Mailbox</h1>

<p align="center">
  Temporary email panel — instant access, zero friction.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/API-Mail.tm-blue" alt="Mail.tm" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

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

- **Onboarding intelligent** — Register or login with one click, random credential generator
- **Quick connect** — Saved accounts with favorites, archiving, and custom labels
- **Synchronized deletion** — Removing an account from the profile or quick-connect list stays in sync
- **Dynamic label** — Custom label displayed after "CONNECTED AS" in the profile dropdown
- **Real-time inbox** — Mercure SSE for live updates with 30s polling fallback
- **Secure mail reader** — Sandboxed iframe (`allow-same-origin` only) for rendering HTML emails
- **Search & filter** — Full-text search across messages
- **Toast notifications** — Success, error, and info feedback
- **Keyboard shortcuts** — `C` to copy email, `R` to refresh
- **Mobile responsive** — Adaptive layout with inbox/detail view toggle
- **Legal compliance** — Footer with mentions legales and privacy policy modals

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx              # Main mailbox UI
    layout.tsx            # Root layout (Geist fonts, dark theme)
    globals.css           # Tailwind + custom animations
    api/mailbox/[...]     # Catch-all API proxy -> Cloudflare Worker
  components/
    AuthForm.tsx           # Login / Register form + quick connect
    Footer.tsx             # Footer with legal modals
    SecureMailIframe.tsx   # Sandboxed HTML email renderer
  lib/
    mailbox.ts             # API client + localStorage persistence
    types.ts               # TypeScript interfaces
cf-proxy/
  index.js                 # Cloudflare Worker (CORS proxy to mail.tm)
  wrangler.toml            # Worker configuration
```

## Architecture

```
Browser (Next.js 16 + React 19)
  └─> /api/mailbox/* (Next.js catch-all route)
       └─> Cloudflare Worker (CORS proxy)
            └─> api.mail.tm (temporary email API)

Realtime updates via Mercure SSE (mercure.mail.tm)
```

## Deploy

```bash
npx vercel --prod
```

**Production** : [https://panel-mail-box.vercel.app](https://panel-mail-box.vercel.app)

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

Created by **QBPG** — contact: `qbpg.sg@outlook.com`
