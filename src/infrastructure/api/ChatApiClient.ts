import axios from "axios";
import type { ChatMessage } from "../../domain/models/ChatMessage";

type ChatApiResponse = {
  role: "assistant";
  content: string;
};

export class ChatApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!this.baseUrl) {
      throw new Error("VITE_API_BASE_URL is missing.");
    }
  }

  async sendMessage(
    message: string,
    history: ChatMessage[],
  ): Promise<ChatApiResponse> {
    const url = `${this.baseUrl}/chat`;

    console.log("Calling API:", url);

    try {
      const response = await axios.post<ChatApiResponse>(url, {
        message,
        history: history.map((item) => ({
          role: item.role,
          content: item.content,
        })),
      });

      console.log("API response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Axios API error:", error);

      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        console.error("URL:", error.config?.url);
      }

      throw error;
    }
  }
}
