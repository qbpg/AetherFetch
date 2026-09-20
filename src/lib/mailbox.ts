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

const FALLBACK_DOMAINS: Domain[] = [
  {
    "@id": "/domains/1",
    "@type": "Domain",
    id: "1",
    domain: "uberip.com",
    isActive: true,
    isPrivate: false,
    created: "",
  },
];

export function generateValidPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specials = "!@#$%^&*";
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  const randChars = (n: number) => Array.from({ length: n }, () => pick(chars + digits)).join("");
  return pick(upper) + pick(chars) + pick(digits) + pick(specials) + randChars(4);
}

let rateLimitUntil = 0;

export function isRateLimited(): boolean {
  return Date.now() < rateLimitUntil;
}

const AUTH_ENDPOINTS = ["/token", "/me", "/accounts", "/domains"];

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers: customHeaders, ...restOptions } = options;

  const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => endpoint.startsWith(ep));
  if (!isAuthEndpoint && Date.now() < rateLimitUntil) {
    throw new Error("Rate limited");
  }

  const mergedHeaders: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: mergedHeaders,
  });

  if (response.status === 204) return null as T;

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 30000;
    rateLimitUntil = Date.now() + Math.min(waitMs, 60000);
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

export async function getDomains(): Promise<Domain[]> {
  try {
    const data = await apiFetch<{ "hydra:member"?: Domain[]; domains?: Domain[]; data?: Domain[] }>("/domains");
    const list = data["hydra:member"] || data.domains || (Array.isArray(data) ? data : null);
    if (Array.isArray(list) && list.length > 0) {
      const active = list.filter((d) => d.isActive);
      if (active.length > 0) return active;
      return list;
    }
  } catch {
    // API unreachable, use fallback
  }
  return FALLBACK_DOMAINS;
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

export async function getMessages(token: string): Promise<MessagesResponse> {
  try {
    const data = await apiFetch<Record<string, unknown>>("/messages", { headers: authHeaders(token) });
    if (Array.isArray(data)) {
      return { "hydra:member": data as Message[], "hydra:totalItems": data.length };
    }
    return data as unknown as MessagesResponse;
  } catch {
    return { "hydra:member": [], "hydra:totalItems": 0 };
  }
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
  _token: string,
  onMessage: () => void
): () => void {
  const url = new URL(MERCURE_URL);
  url.searchParams.append("topic", `/accounts/${accountId}`);

  let eventSource: EventSource | null = null;
  let alive = true;

  function connect() {
    if (!alive) return;
    try {
      eventSource = new EventSource(url.toString());
      eventSource.onmessage = () => onMessage();
      eventSource.onerror = () => {
        eventSource?.close();
        if (alive) setTimeout(connect, 5000);
      };
    } catch {
      if (alive) setTimeout(connect, 5000);
    }
  }

  connect();

  return () => {
    alive = false;
    eventSource?.close();
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
