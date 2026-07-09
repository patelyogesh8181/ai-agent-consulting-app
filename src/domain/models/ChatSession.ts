import type { ChatMessage } from "./ChatMessage";

export interface ChatSession {
  id: string;
  title: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}
