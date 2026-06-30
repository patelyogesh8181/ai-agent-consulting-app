import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../domain/entities/ChatMessage";
import { ChatApiClient } from "../../infrastructure/api/ChatApi";
import { SendMessageUseCase } from "../../useCases/SendMessageUseCase";

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello. I am your Enterprise IT Consulting AI Agent. Ask me about architecture, cloud, DevOps, Gen AI, modernization, or solution design.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessageUseCase = useMemo(() => {
    return new SendMessageUseCase(new ChatApiClient());
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const assistantMessage = await sendMessageUseCase.execute(input);
      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "The consulting agent could not process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-page">
      <h1>Consulting AI Agent</h1>

      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}

        {loading && <div className="message assistant">Thinking...</div>}
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          placeholder="Ask an IT consulting question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </section>
  );
}

// import { ChatWindow } from "../../components/chat/ChatWindow";
// import { ChatInput } from "../../components/chat/ChatInput";
// import { useChat } from "../../hooks/useChat";

// export default function ChatPage() {
//   const { messages, loading, sendMessage } = useChat();

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       <header className="border-b bg-white p-4 shadow">
//         <h1 className="text-xl font-semibold">IT Consulting AI</h1>
//       </header>

//       <ChatWindow messages={messages} loading={loading} />

//       <ChatInput onSend={sendMessage} disabled={loading} />
//     </div>
//   );
// }
