export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Max-Age": "3600",
        },
      });
    }

    if (url.pathname === "/") {
      return new Response(JSON.stringify({ status: "ok", service: "mailbox-proxy" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const targetPath = url.pathname.replace(/^\//, "");
    const targetUrl = `${env.MAIL_TM_BASE}/${targetPath}${url.search}`;

    const headers = new Headers();
    headers.set("Accept", "application/json");
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
    headers.set("Accept-Language", "en-US,en;q=0.9");
    headers.set("Sec-Fetch-Dest", "empty");
    headers.set("Sec-Fetch-Mode", "cors");
    headers.set("Sec-Fetch-Site", "cross-site");

    headers.set("Content-Type", "application/json");

    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers.set("Authorization", authHeader);
    }

    const init = {
      method: request.method,
      headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const body = await request.text();
      if (body) {
        init.body = body;
      }
    }

    const resp = await fetch(targetUrl, init);

    const respHeaders = new Headers();
    respHeaders.set("Access-Control-Allow-Origin", "*");
    respHeaders.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    respHeaders.set("Access-Control-Allow-Headers", "Content-Type,Authorization");

    const respContentType = resp.headers.get("content-type") || "application/json";
    respHeaders.set("Content-Type", respContentType);

    const body = await resp.text();

    return new Response(body, {
      status: resp.status,
      headers: respHeaders,
    });
  },
};
