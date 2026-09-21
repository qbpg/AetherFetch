/**
 * ChatGPT adapter (chatgpt.com)
 * Minimalist detection and state display
 */

const CHATGPT_DOMAINS = ["chatgpt.com", "openai.com"];

export class ChatGPTAdapter {
  static detect(): boolean {
    const hostname = self?.location?.hostname || "";
    return CHATGPT_DOMAINS.some((d) => hostname.includes(d));
  }

  static getPlatformName(): string {
    return "ChatGPT";
  }

  static getStatusSelector(): string {
    return "nav[aria-label*='conversation'], [aria-label*='ChatGPT'], button[aria-label*='New chat']";
  }

  static getHeaderSelector(): string {
    return "h1, h2";
  }

  static getContentArea(): string {
    return ".chat,.conversation,.markdown-body";
  }
}

export default ChatGPTAdapter;