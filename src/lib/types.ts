export interface Domain {
  "@id": string;
  "@type": string;
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  created: string;
}

export interface PlatformAdapter {
  detect(): boolean;
  getPlatformName(): string;
  getStatusSelector(): string;
  getHeaderSelector(): string;
  getContentArea(): string;
}

export interface PlatformDetection {
  platform: keyof typeof PlatformAdapters | null;
  confidence: number;
  domain: string;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

export interface Account {
  "@id": string;
  "@type": string;
  id: string;
  address: string;
  quota: number;
  used: number;
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  token: string;
}

export interface Message {
  "@id": string;
  "@type": string;
  id: string;
  seq: number;
  subject: string;
  intro: string;
  from: MessageAddress;
  to: MessageAddress[];
  createdAt: string;
  updatedAt: string;
  size: number;
  seen: boolean;
}

export interface MessageAddress {
  address: string;
  name: string;
}

export interface MessageDetail {
  "@id": string;
  "@type": string;
  id: string;
  seq: number;
  subject: string;
  intro: string;
  from: MessageAddress;
  to: MessageAddress[];
  cc: MessageAddress[];
  bcc: MessageAddress[];
  createdAt: string;
  updatedAt: string;
  size: number;
  seen: boolean;
  text: string;
  html: string[];
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding: string;
  related: boolean;
  size: number;
}

export interface MessagesResponse {
  "hydra:member": Message[];
  "hydra:totalItems": number;
}

export interface SessionData {
  token: string;
  email: string;
  password: string;
  accountId: string;
}

export interface SavedAccount {
  address: string;
  password: string;
  createdAt: string;
  label?: string;
  favorite?: boolean;
  archived?: boolean;
}

export const PlatformAdapters = {
  claude: require("./ai-adapters/claude").default,
  chatgpt: require("./ai-adapters/chatgpt").default,
  deepseek: require("./ai-adapters/deepseek").default,
  mistral: require("./ai-adapters/mistral").default,
};