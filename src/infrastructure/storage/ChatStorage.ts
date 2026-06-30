import type { ChatMessage } from "../../domain/models/ChatMessage";
import type { ChatSession } from "../../domain/models/ChatSession";

const SESSIONS_KEY = "it-consulting-ai-chat-sessions";
const ACTIVE_CHAT_KEY = "it-consulting-ai-active-chat-id";

export class ChatStorage {
  getSessions(): ChatSession[] {
    const value = localStorage.getItem(SESSIONS_KEY);
    if (!value) return [];

    try {
      return JSON.parse(value) as ChatSession[];
    } catch {
      return [];
    }
  }

  saveSessions(sessions: ChatSession[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  getActiveChatId(): string | null {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  }

  setActiveChatId(chatId: string): void {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
  }

  createSession(messages: ChatMessage[] = []): ChatSession {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages,
    };

    const sessions = [session, ...this.getSessions()];
    this.saveSessions(sessions);
    this.setActiveChatId(session.id);

    return session;
  }

  updateSession(chatId: string, messages: ChatMessage[]): void {
    const sessions = this.getSessions();

    const updated = sessions.map((session) => {
      if (session.id !== chatId) return session;

      return {
        ...session,
        title: this.generateTitle(messages),
        messages,
        updatedAt: new Date().toISOString(),
      };
    });

    this.saveSessions(updated);
  }

  getSession(chatId: string): ChatSession | undefined {
    return this.getSessions().find((x) => x.id === chatId);
  }

  private generateTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find((x) => x.role === "user");

    if (!firstUserMessage) return "New Chat";

    return firstUserMessage.content.length > 40
      ? `${firstUserMessage.content.substring(0, 40)}...`
      : firstUserMessage.content;
  }
}
