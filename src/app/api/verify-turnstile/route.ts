const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || "";

export async function POST(request: Request) {
  if (!TURNSTILE_SECRET) {
    return Response.json({ success: true, message: "Turnstile verification skipped (no secret key configured)" });
  }

  try {
    const { token } = await request.json();
    if (!token) {
      return Response.json({ success: false, error: "Missing token" }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET);
    formData.append("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const result = await res.json();
    return Response.json(result);
  } catch (err: unknown) {
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}
