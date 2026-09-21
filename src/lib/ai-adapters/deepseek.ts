/**
 * DeepSeek adapter (chat.deepseek.com)
 * Minimalist detection and state display
 */

const DEEPSEEK_DOMAINS = ["chat.deepseek.com", "deepseek.com"];

export class DeepSeekAdapter {
  static detect(): boolean {
    const hostname = self?.location?.hostname || "";
    return DEEPSEEK_DOMAINS.some((d) => hostname.includes(d));
  }

  static getPlatformName(): string {
    return "DeepSeek";
  }

  static getStatusSelector(): string {
    return "nav[aria-label*='conversation'], [aria-label*='DeepSeek'], .chat-input,.chat-message";
  }

  static getHeaderSelector(): string {
    return "h1, h2,.model-name";
  }

  static getContentArea(): string {
    return ".chat-box,.conversation,.markdown-content";
  }
}

export default DeepSeekAdapter;