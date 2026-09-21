/**
 * Mistral adapter (chat.mistral.ai)
 * Minimalist detection and state display
 */

const MISTRAL_DOMAINS = ["chat.mistral.ai", "mistral.ai"];

export class MistralAdapter {
  static detect(): boolean {
    const hostname = self?.location?.hostname || "";
    return MISTRAL_DOMAINS.some((d) => hostname.includes(d));
  }

  static getPlatformName(): string {
    return "Mistral";
  }

  static getStatusSelector(): string {
    return "nav[aria-label*='conversation'], [aria-label*='Mistral'], .chat-container,.message-list";
  }

  static getHeaderSelector(): string {
    return "h1, h2,.model-title";
  }

  static getContentArea(): string {
    return ".chat-content,.conversation,.message-body";
  }
}

export default MistralAdapter;