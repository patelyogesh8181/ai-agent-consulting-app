import type { IChatRepository } from "../../domain/repositories/IChatRepository";
import type { ChatMessage } from "../../domain/models/ChatMessage";
import { ChatApiClient } from "../api/ChatApiClient";

export class ChatRepository implements IChatRepository {
  private readonly chatApiClient: ChatApiClient;

  constructor(chatApiClient: ChatApiClient) {
    this.chatApiClient = chatApiClient;
  }

  async sendMessage(
    message: string,
    history: ChatMessage[],
  ): Promise<ChatMessage> {
    debugger;
    const response = await this.chatApiClient.sendMessage(message, history);

    return {
      id: crypto.randomUUID(),
      role: response.role,
      content: response.content,
      createdAt: new Date().toISOString(),
    };
  }
}
