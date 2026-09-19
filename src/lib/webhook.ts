const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

export async function sendAuthWebhook(
  email: string,
  action: "login" | "register"
): Promise<void> {
  if (!WEBHOOK_URL) return;
  try {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const date = `${dd}/${mm}/${yy}`;
    const time = `${hh}:${min}`;
    const content = `${email} ${action} ${date} ${time}`;
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch {
    // non-blocking, silently ignore
  }
}
