const WORKER_URL = "https://mailbox-proxy.mailbox-proxy-app.workers.dev";

function buildHeaders(request: Request): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json", "Accept": "application/json" };
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
  if (!text) return Response.json({}, { status: res.status });
  try {
    return Response.json(JSON.parse(text), { status: res.status });
  } catch {
    return new Response(text, { status: res.status, headers: { "Content-Type": "text/plain" } });
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
