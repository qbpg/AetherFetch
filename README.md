<p align="center">
  <img src="public/logo.svg" alt="AetherFetch logo" width="64">
</p>

<h1 align="center">AetherFetch</h1>

<p align="center">Temporary inboxes, without the clutter.</p>

<p align="center">
  <a href="https://aetherfetch.vercel.app/">Live site</a> ·
  <a href="#run-locally">Run locally</a> ·
  <a href="#how-it-works">How it works</a>
</p>

AetherFetch lets you create a temporary email address, read incoming mail, and switch between saved accounts. It currently uses [mail.tm](https://mail.tm) for addresses and delivery.

## What you can do

- Create an address or sign in to an existing mail.tm account.
- Save multiple accounts, add labels, and mark accounts as favorites or archived.
- Read, search, and delete messages; load older pages when needed.
- Pick out verification codes and links from messages.
- Download attachments and copy your address quickly.
- Get new mail updates through Mercure, with periodic refresh as a fallback.

Press `C` to copy the current address or `R` to refresh the inbox. Shortcuts are ignored while typing in a form.

## Built with

<p>
  <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nextjs/default.svg" alt="Next.js" width="28" height="28"> &nbsp;
  <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/cloudflare-workers/default.svg" alt="Cloudflare Workers" width="28" height="28"> &nbsp;
  <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/vercel/default.svg" alt="Vercel" width="28" height="28">
</p>

Next.js 16, React 19, TypeScript, Tailwind CSS 4, a Cloudflare Worker, and the mail.tm API. The icons above are from [theSVG](https://thesvg.org/).

## Run locally

You'll need Node.js and npm.

```bash
git clone https://github.com/qbpg/AetherFetch.git
cd AetherFetch
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The app uses the Cloudflare Worker URL set in `src/app/api/mailbox/[...path]/route.ts`, so that Worker and mail.tm must be reachable. The current code does not require a local `.env` file.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## How it works

```text
Browser → Next.js /api/mailbox/* → Cloudflare Worker → mail.tm
Browser → mail.tm Mercure endpoint for live updates
```

The Next.js API route forwards mailbox requests to the Worker. The Worker forwards them to mail.tm. If the live connection drops, the inbox still refreshes periodically.

Saved accounts and the active session are kept in your browser's `localStorage`. Saved account passwords are stored there too. Clearing site data removes those saved details, and a shared device can expose them to other users of that browser. Avoid using temporary inboxes for sensitive or long-term accounts.

### Use your own Worker

Deploy the Worker in `cf-proxy/` and set `WORKER_URL` in `src/app/api/mailbox/[...path]/route.ts` to its URL. `MAIL_TM_BASE` in `cf-proxy/wrangler.toml` currently points to `https://api.mail.tm`.

```bash
cd cf-proxy
npx wrangler deploy
```

The frontend can be deployed on Vercel. The Worker URL is currently hardcoded, so update it before deploying your own copy.

## Current limits

AetherFetch does not run its own mail server or offer addresses on a custom AetherFetch domain yet. Available domains and mail delivery depend on mail.tm. Inbox search covers the messages loaded in the interface.

## License

[MIT](LICENSE).
