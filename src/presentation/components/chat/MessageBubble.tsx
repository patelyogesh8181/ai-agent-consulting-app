import { ChatMessage } from "../../domain/entities/ChatMessage";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-xl px-4 py-3 max-w-3xl ${
          isUser ? "bg-blue-600 text-white" : "bg-white shadow"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
