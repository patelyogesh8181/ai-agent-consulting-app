import type { ChatMessage } from "../../domain/models/ChatMessage";
import type { ChatSession } from "../../domain/models/ChatSession";

const SESSIONS_KEY = "it-consulting-ai-chat-sessions";
const ACTIVE_CHAT_KEY = "it-consulting-ai-active-chat-id";

export class ChatStorage {
  getSessions(): ChatSession[] {
    const value = localStorage.getItem(SESSIONS_KEY);
    if (!value) return [];

    try {
      const sessions = JSON.parse(value) as ChatSession[];

      return this.sortSessions(
        sessions.map((session) => ({
          ...session,
          isPinned: session.isPinned ?? false,
        })),
      );
    } catch {
      return [];
    }
  }

  getSession(chatId: string): ChatSession | undefined {
    return this.getSessions().find((session) => session.id === chatId);
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

  pinSession(chatId: string): ChatSession[] {
    const sessions = this.getSessions().map((session) =>
      session.id === chatId
        ? {
            ...session,
            isPinned: !session.isPinned,
            updatedAt: new Date().toISOString(),
          }
        : session,
    );

    const sortedSessions = this.sortSessions(sessions);

    this.saveSessions(sortedSessions);

    return sortedSessions;
  }

  renameSession(chatId: string, title: string): ChatSession[] {
    const sessions = this.getSessions().map((session) =>
      session.id === chatId
        ? {
            ...session,
            title: title.trim() || "New Chat",
            updatedAt: new Date().toISOString(),
          }
        : session,
    );

    this.saveSessions(sessions);

    return this.getSessions();
  }

  deleteSession(chatId: string): ChatSession[] {
    const sessions = this.getSessions().filter((x) => x.id !== chatId);

    this.saveSessions(sessions);

    const activeChatId = this.getActiveChatId();

    if (activeChatId === chatId) {
      if (sessions.length > 0) {
        this.setActiveChatId(sessions[0].id);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    }

    return this.getSessions();
  }

  private generateTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find((x) => x.role === "user");

    if (!firstUserMessage) return "New Chat";

    return firstUserMessage.content.length > 40
      ? `${firstUserMessage.content.substring(0, 40)}...`
      : firstUserMessage.content;
  }

  private sortSessions(sessions: ChatSession[]): ChatSession[] {
    return [...sessions].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
}
