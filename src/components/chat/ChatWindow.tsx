import { ChatMessage } from "../../domain/entities/ChatMessage";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export function ChatWindow({ messages, loading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {loading && <TypingIndicator />}
    </div>
  );
}
