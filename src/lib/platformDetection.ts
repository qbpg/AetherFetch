import type { PlatformAdapter, PlatformDetection } from "./types";
import claude from "./ai-adapters/claude";
import chatgpt from "./ai-adapters/chatgpt";
import deepseek from "./ai-adapters/deepseek";
import mistral from "./ai-adapters/mistral";

const PlatformAdapters = { claude, chatgpt, deepseek, mistral };

const DOMAIN_MAP: Record<string, keyof typeof PlatformAdapters> = {
  "claude.ai": "claude",
  "claude.com": "claude",
  "chatgpt.com": "chatgpt",
  "openai.com": "chatgpt",
  "chat.deepseek.com": "deepseek",
  "deepseek.com": "deepseek",
  "chat.mistral.ai": "mistral",
  "mistral.ai": "mistral",
};

export function detectPlatform(): PlatformDetection {
  try {
    const hostname = self?.location?.hostname || "";
    const normalized = hostname.toLowerCase();

    for (const [domain, platform] of Object.entries(DOMAIN_MAP)) {
      if (normalized.includes(domain.toLowerCase())) {
        const adapter = PlatformAdapters[platform];
        if (adapter) {
          return {
            platform,
            confidence: 1.0,
            domain: hostname,
          };
        }
      }
    }

    return {
      platform: null,
      confidence: 0,
      domain: (self?.location?.hostname || "unknown"),
    };
  } catch {
    return {
      platform: null,
      confidence: 0,
      domain: "unknown",
    };
  }
}

export function getCurrentAdapter(): PlatformAdapter | null {
  const detection = detectPlatform();
  if (!detection.platform) return null;
  return PlatformAdapters[detection.platform];
}

export function getPlatformName(): string {
  const detection = detectPlatform();
  if (!detection.platform) return "Unknown";
  const adapter = PlatformAdapters[detection.platform];
  if (!adapter) return "Unknown";
  return adapter.getPlatformName();
}

export function getStatusSelector(): string {
  const adapter = getCurrentAdapter();
  if (!adapter) return "";
  return adapter.getStatusSelector();
}

export function getHeaderSelector(): string {
  const adapter = getCurrentAdapter();
  if (!adapter) return "";
  return adapter.getHeaderSelector();
}

export function getContentArea(): string {
  const adapter = getCurrentAdapter();
  if (!adapter) return "";
  return adapter.getContentArea();
}
