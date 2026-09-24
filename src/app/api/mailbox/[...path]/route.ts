import { after } from "next/server";

const WORKER_URL = "https://mailbox-proxy.mailbox-proxy-app.workers.dev";

async function notifyAccountCreated(response: Response) {
  const webhook = process.env.DISCORD_ACCOUNT_WEBHOOK_URL;
  if (!webhook) return;

  let url: URL;
  try {
    url = new URL(webhook);
  } catch {
    console.error("Discord account webhook URL is invalid");
    return;
  }
  if (url.protocol !== "https:" || !["discord.com", "discordapp.com"].includes(url.hostname) || !url.pathname.startsWith("/api/webhooks/")) {
    console.error("Discord account webhook URL must be a Discord webhook");
    return;
  }

  try {
    const account: unknown = await response.clone().json();
    const address = account && typeof account === "object" && "address" in account ? account.address : undefined;
    if (typeof address !== "string") return;

    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "New AetherFetch address",
          description: `\`${address.replaceAll("`", "")}\``,
          color: 0x6366f1,
          timestamp: new Date().toISOString(),
        }],
        allowed_mentions: { parse: [] },
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!result.ok) console.error("Discord account webhook failed with status", result.status);
  } catch {
    console.error("Discord account webhook request failed");
  }
}

function buildHeaders(request: Request): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": request.headers.get("Content-Type") || "application/json",
    "Accept": "application/json",
  };
  const auth = request.headers.get("Authorization");
  if (auth) h["Authorization"] = auth;
  return h;
}

function proxyPath(request: Request): string {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/mailbox", "");
  return `${WORKER_URL}${path}${url.search || ""}`;
}

async function proxyResponse(res: Response): Promise<Response> {
  if (res.status === 204) return new Response(null, { status: 204 });
  const text = await res.text();
  const headers = new Headers();
  const retryAfter = res.headers.get("Retry-After");
  if (retryAfter) headers.set("Retry-After", retryAfter);
  headers.set("Cache-Control", "no-store");
  if (!text) return Response.json({}, { status: res.status, headers });
  try {
    return Response.json(JSON.parse(text), { status: res.status, headers });
  } catch {
    headers.set("Content-Type", "text/plain");
    return new Response(text, { status: res.status, headers });
  }
}

export async function GET(request: Request) {
  try {
    const res = await fetch(proxyPath(request), { method: "GET", headers: buildHeaders(request), cache: "no-store" });
    return proxyResponse(res);
  } catch (err: unknown) {
    return Response.json({ error: err instanceof Error ? err.message : "Proxy Error" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const res = await fetch(proxyPath(request), { method: "POST", headers: buildHeaders(request), body, cache: "no-store" });
    if (new URL(request.url).pathname === "/api/mailbox/accounts" && res.ok && process.env.DISCORD_ACCOUNT_WEBHOOK_URL) {
      after(() => notifyAccountCreated(res.clone()));
    }
    return proxyResponse(res);
  } catch (err: unknown) {
    return Response.json({ error: err instanceof Error ? err.message : "Proxy Error" }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.text();
    const res = await fetch(proxyPath(request), { method: "PATCH", headers: buildHeaders(request), body, cache: "no-store" });
    return proxyResponse(res);
  } catch (err: unknown) {
    return Response.json({ error: err instanceof Error ? err.message : "Proxy Error" }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  try {
    const res = await fetch(proxyPath(request), { method: "DELETE", headers: buildHeaders(request), cache: "no-store" });
    return proxyResponse(res);
  } catch (err: unknown) {
    return Response.json({ error: err instanceof Error ? err.message : "Proxy Error" }, { status: 502 });
  }
}
