import type { ChatMessage } from "../domain/entities/ChatMessage";
import { ChatApiClient } from "../infrastructure/api/ChatApi";

export class SendMessageUseCase {
  constructor(private readonly chatApiClient: ChatApiClient) {}

  async execute(message: string): Promise<ChatMessage> {
    if (!message.trim()) {
      throw new Error("Message cannot be empty.");
    }

    return this.chatApiClient.sendMessage(message);
  }
}
