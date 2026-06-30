import type { ChatMessage } from "../models/ChatMessage";

export interface IChatRepository {
  sendMessage(message: string, history: ChatMessage[]): Promise<ChatMessage>;
}
