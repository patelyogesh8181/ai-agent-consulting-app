import axios from "axios";
import type { ChatMessage } from "../../domain/entities/ChatMessage";

export class ChatApiClient {
  private readonly baseUrl = import.meta.env.VITE_API_BASE_URL;
  constructor() {
    console.log("baseUrl", this.baseUrl);
  }
  async sendMessage(message: string): Promise<ChatMessage> {
    const response = await axios.post<ChatMessage>(`${this.baseUrl}/chat`, {
      message,
    });

    return response.data;
  }
}
