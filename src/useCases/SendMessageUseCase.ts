import type { ChatMessage } from "../domain/models/ChatMessage";
import type { IChatRepository } from "../domain/repositories/IChatRepository";

export class SendMessageUseCase {
  private readonly chatRepository: IChatRepository;

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository;
  }

  async execute(message: string, history: ChatMessage[]): Promise<ChatMessage> {
    if (!message.trim()) {
      throw new Error("Message cannot be empty.");
    }

    return this.chatRepository.sendMessage(message, history);
  }
}
