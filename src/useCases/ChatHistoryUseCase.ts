import type { ChatSession } from "../domain/models/ChatSession";
import type { ChatStorage } from "../infrastructure/storage/ChatStorage";

export class ChatHistoryUseCase {
  constructor(private readonly chatStorage: ChatStorage) {}

  pin(chatId: string): ChatSession[] {
    return this.chatStorage.pinSession(chatId);
  }

  rename(chatId: string, title: string): ChatSession[] {
    return this.chatStorage.renameSession(chatId, title);
  }

  delete(chatId: string): ChatSession[] {
    return this.chatStorage.deleteSession(chatId);
  }
}
