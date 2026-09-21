/**
 * Claude.ai adapter
 * Minimalist detection and state display
 * Follows the original gemini-wiper-tool pattern:
 * - Domain-based detection
 * - Robust selectors (aria-label, nav structure)
 * - No heavy branding, just functional display
 */

const CLAUDE_DOMAINS = ["claude.ai", "claude.com"];

export class ClaudeAdapter {
  static detect(): boolean {
    const hostname = self?.location?.hostname || "";
    return CLAUDE_DOMAINS.some((d) => hostname.includes(d));
  }

  static getPlatformName(): string {
    return "Claude";
  }

  static getStatusSelector(): string {
    // Robust selector using aria-label and nav structure
    return "nav[aria-label*='conversation'], [aria-label*='Claude'], .prose,.markdown";
  }

  static getHeaderSelector(): string {
    // Primary heading selector
    return "h1, h2, h3";
  }

  static getContentArea(): string {
    // Main content container
    return ".content,.markdown-content,.prose";
  }
}

export default ClaudeAdapter;