import type {
  Domain,
  Account,
  TokenResponse,
  Message,
  MessageDetail,
  MessagesResponse,
  SessionData,
  SavedAccount,
} from "./types";

const BASE_URL = "/api/mailbox";

export function generateValidPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specials = "!@#$%^&*";
  const pick = (s: string) => s[crypto.getRandomValues(new Uint32Array(1))[0] % s.length];
  const randChars = (n: number) => Array.from({ length: n }, () => pick(chars + digits)).join("");
  const password = pick(upper) + pick(chars) + pick(digits) + pick(specials) + randChars(8);
  const shuffled = Array.from(password);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.join("");
}

let rateLimitUntil = 0;

export function isRateLimited(): boolean {
  return Date.now() < rateLimitUntil;
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers: customHeaders, ...restOptions } = options;

  if (Date.now() < rateLimitUntil) {
    throw new Error("Rate limited");
  }

  const mergedHeaders: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...restOptions,
      headers: mergedHeaders,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 204) return null as T;

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const seconds = retryAfter ? Number.parseInt(retryAfter, 10) : NaN;
    const date = retryAfter ? Date.parse(retryAfter) : NaN;
    const waitMs = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : Number.isFinite(date) ? date - Date.now() : 60000;
    rateLimitUntil = Date.now() + Math.min(Math.max(waitMs, 1000), 300000);
    throw new Error("Rate limited");
  }

  let data: Record<string, unknown>;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }
    throw new Error("Unexpected response from server. Please try again later.");
  }

  if (!response.ok) {
    const detail =
      data["hydra:description"] || data.detail || data.message || data.error ||
      `Error ${response.status}`;
    throw new Error(typeof detail === "string" ? detail : `Error ${response.status}`);
  }

  return data as T;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

let cachedDomains: { list: Domain[]; expires: number } | null = null;

export async function getDomains(): Promise<Domain[]> {
  if (cachedDomains && Date.now() < cachedDomains.expires) return cachedDomains.list;
  const data = await apiFetch<{ "hydra:member"?: Domain[]; domains?: Domain[]; data?: Domain[] }>("/domains");
  const list = data["hydra:member"] || data.domains || data.data || (Array.isArray(data) ? data : null);
  if (!Array.isArray(list)) throw new Error("Could not load available domains");
  const active = list.filter((domain) => domain.isActive);
  if (active.length === 0) throw new Error("No domains are currently available");
  cachedDomains = { list: active, expires: Date.now() + 10 * 60 * 1000 };
  return active;
}

export async function createAccount(address: string, password: string): Promise<Account> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  return apiFetch<Account>("/accounts", {
    method: "POST",
    headers,
    body: JSON.stringify({ address, password }),
  });
}

export async function getToken(address: string, password: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/token", {
    method: "POST",
    body: JSON.stringify({ address, password }),
  });
}

export async function getMe(token: string): Promise<Account> {
  return apiFetch<Account>("/me", { headers: authHeaders(token) });
}

export async function deleteAccount(token: string, accountId: string): Promise<void> {
  await apiFetch(`/accounts/${accountId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function getMessages(token: string, page = 1): Promise<MessagesResponse> {
  const data = await apiFetch<Record<string, unknown>>(`/messages?page=${page}`, { headers: authHeaders(token) });
  if (Array.isArray(data)) {
    return { "hydra:member": data as Message[], "hydra:totalItems": data.length };
  }
  if (!Array.isArray(data["hydra:member"])) throw new Error("Invalid message response");
  return data as unknown as MessagesResponse;
}

export async function downloadAttachment(token: string, attachment: { downloadUrl?: string; filename: string }): Promise<void> {
  if (!attachment.downloadUrl) throw new Error("Attachment download is unavailable");
  const url = new URL(attachment.downloadUrl, "https://api.mail.tm");
  if (url.origin !== "https://api.mail.tm") throw new Error("Untrusted attachment URL");
  const response = await fetch(url.toString(), { headers: authHeaders(token) });
  if (!response.ok) throw new Error(`Download failed (${response.status})`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = attachment.filename || "attachment";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
}

export async function getMessage(token: string, messageId: string): Promise<MessageDetail> {
  return apiFetch<MessageDetail>(`/messages/${messageId}`, { headers: authHeaders(token) });
}

export async function deleteMessage(token: string, messageId: string): Promise<void> {
  await apiFetch(`/messages/${messageId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function markAsRead(token: string, messageId: string): Promise<void> {
  await apiFetch(`/messages/${messageId}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/merge-patch+json",
    },
    body: JSON.stringify({ seen: true }),
  });
}

const MERCURE_URL = "https://mercure.mail.tm/.well-known/mercure";

export function subscribeMercure(
  accountId: string,
  token: string,
  onMessage: () => void,
  onStatus: (connected: boolean) => void
): () => void {
  const url = new URL(MERCURE_URL);
  url.searchParams.append("topic", `/accounts/${accountId}`);

  const controller = new AbortController();
  let alive = true;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  async function connect() {
    if (!alive) return;
    try {
      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok || !response.body) throw new Error("Live connection unavailable");
      onStatus(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (alive) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary = buffer.search(/\r?\n\r?\n/);
        while (boundary >= 0) {
          const event = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, "");
          if (event.split(/\r?\n/).some((line) => line.startsWith("data:"))) onMessage();
          boundary = buffer.search(/\r?\n\r?\n/);
        }
      }
    } catch {
      // Polling remains active when the browser cannot reach Mercure.
    }
    if (alive) {
      onStatus(false);
      retryTimer = setTimeout(connect, 5000);
    }
  }

  void connect();

  return () => {
    alive = false;
    if (retryTimer) clearTimeout(retryTimer);
    controller.abort();
  };
}

const SESSION_KEY = "mailbox_session";

export function saveSession(data: SessionData): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    }
  } catch { /* storage full or blocked */ }
}

export function getSession(): SessionData | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch { /* noop */ }
}

const SAVED_ACCOUNTS_KEY = "mailbox_saved_accounts";

export function getSavedAccounts(): SavedAccount[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedAccount[];
  } catch {
    return [];
  }
}

export function saveAccountToHistory(address: string, password: string, label?: string): void {
  try {
    if (typeof window === "undefined") return;
    const accounts = getSavedAccounts();
    const existing = accounts.findIndex((a) => a.address === address);
    if (existing >= 0) {
      accounts[existing].password = password;
      accounts[existing].createdAt = accounts[existing].createdAt || new Date().toISOString();
      if (label !== undefined) accounts[existing].label = label;
    } else {
      accounts.push({ address, password, createdAt: new Date().toISOString(), label: label || undefined });
    }
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch { /* storage full or blocked */ }
}

export function removeSavedAccount(address: string): void {
  try {
    if (typeof window === "undefined") return;
    const accounts = getSavedAccounts().filter((a) => a.address !== address);
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch { /* noop */ }
}

export function toggleFavorite(address: string): void {
  try {
    if (typeof window === "undefined") return;
    const accounts = getSavedAccounts();
    const acc = accounts.find((a) => a.address === address);
    if (acc) {
      acc.favorite = !acc.favorite;
      localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  } catch { /* noop */ }
}

export function toggleArchive(address: string): void {
  try {
    if (typeof window === "undefined") return;
    const accounts = getSavedAccounts();
    const acc = accounts.find((a) => a.address === address);
    if (acc) {
      acc.archived = !acc.archived;
      localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  } catch { /* noop */ }
}

export function updateAccountLabel(address: string, label: string): void {
  try {
    if (typeof window === "undefined") return;
    const accounts = getSavedAccounts();
    const acc = accounts.find((a) => a.address === address);
    if (acc) {
      acc.label = label || undefined;
      localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  } catch { /* noop */ }
}
