import { useState } from "react";
import { ChatMessage } from "../../domain/models/ChatMessage";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    // AI call will come here

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Placeholder AI response",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      setLoading(false);
    }, 1000);
  }

  return {
    messages,
    loading,
    sendMessage,
  };
}
