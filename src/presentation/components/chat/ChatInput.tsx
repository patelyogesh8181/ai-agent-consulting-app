import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    onSend(text);

    setText("");
  };

  return (
    <div className="border-t bg-white p-4 flex gap-3">
      <input
        className="flex-1 border rounded p-3"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />

      <button
        onClick={submit}
        disabled={disabled}
        className="bg-blue-600 text-white px-6 rounded"
      >
        Send
      </button>
    </div>
  );
}
