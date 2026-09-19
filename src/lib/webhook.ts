const DISCORD_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  process.env.WEBHOOK_URL ||
  "https://discord.com/api/webhooks/1550933800282755072/bgwYi4SckJVQBPd8LEIDuV58iMal-FLt53_ceAj96AAnytyhJ0XmKSjneDf4JD8hDKgj";

const WEBHOOK_TIMEOUT_MS = 5000;

export async function sendAuthWebhook(
  email: string,
  action: "login" | "register"
): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) return;

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const date = `${dd}/${mm}/${yy}`;
  const time = `${hh}:${min}`;
  const content = `${email} ${action} ${date} ${time}`;

  console.log("Dispatching webhook for:", email, action);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`Webhook failed with status ${res.status}`);
    }
  } catch (err) {
    console.error("Webhook dispatch error:", err);
  }
}
