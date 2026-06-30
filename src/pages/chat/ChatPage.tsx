import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../domain/models/ChatMessage";
import { container } from "../../app/container";
import { ChatStorage } from "../../infrastructure/storage/ChatStorage";
import "./ChatPage.css";
import type { ChatSession } from "../../domain/models/ChatSession";

const chatStorage = new ChatStorage();

const welcomeMessage: ChatMessage = {
  id: crypto.randomUUID(),
  role: "assistant",
  content:
    "Hello. I am your Enterprise IT Consulting AI Agent. Ask me about enterprise architecture, cloud modernization, DevOps, AI agents, security, or solution design.",
  createdAt: new Date().toISOString(),
};

const createEmptySession = (): ChatSession => ({
  id: crypto.randomUUID(),
  title: "New Chat",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [welcomeMessage],
});

export function ChatPage() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [sessions, setSessions] = useState<ChatSession[]>(() =>
    chatStorage.getSessions(),
  );

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    const existingActiveId = chatStorage.getActiveChatId();

    if (existingActiveId) return existingActiveId;

    const session = chatStorage.createSession([welcomeMessage]);
    return session.id;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const activeId = chatStorage.getActiveChatId();
    const activeSession = activeId
      ? chatStorage.getSession(activeId)
      : undefined;

    return activeSession?.messages?.length
      ? activeSession.messages
      : [welcomeMessage];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeChatId) return;

    chatStorage.updateSession(activeChatId, messages);

    setSessions(chatStorage.getSessions());

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const assistantMessage = await container.sendMessageUseCase.execute(
        input,
        nextMessages,
      );

      setMessages([...nextMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat API error:", error);

      setMessages([
        ...nextMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I could not process the request. Please verify the API, CORS, model configuration, and backend logs.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    // Create a brand new session
    const newSession = createEmptySession();

    // Save it
    const updatedSessions = [newSession, ...chatStorage.getSessions()];
    chatStorage.saveSessions(updatedSessions);

    // Make it active
    chatStorage.setActiveChatId(newSession.id);

    // Update React state
    setSessions(updatedSessions);
    setActiveChatId(newSession.id);
    setMessages(newSession.messages);
    setInput("");
  };

  const openChat = (session: ChatSession) => {
    chatStorage.setActiveChatId(session.id);

    setActiveChatId(session.id);
    setMessages([...session.messages]); // create a new array reference
    setInput("");
  };

  return (
    <section className="enterprise-chat-page">
      <aside className="chat-sidebar">
        <div className="brand-block">
          <div className="brand-icon">AI</div>
          <div>
            <h2>Consulting Agent</h2>
            <p>Enterprise Architecture Assistant</p>
          </div>
        </div>

        <button className="new-chat-button" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="sidebar-section">
          <h4>Chat History</h4>

          <div className="chat-history-list">
            {sessions.map((session) => (
              <button
                key={session.id}
                className={
                  session.id === activeChatId
                    ? "chat-history-item active-chat"
                    : "chat-history-item"
                }
                onClick={() => openChat(session)}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1>IT Consulting AI Agent</h1>
            <p>Architecture-grade guidance powered by your C# AI API</p>
          </div>

          <span className="status-pill">Online</span>
        </header>

        <div className="chat-conversation">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-message-row ${message.role}`}
            >
              <div className="avatar">
                {message.role === "user" ? "You" : "AI"}
              </div>

              <div className="message-card">
                <div className="message-meta">
                  <strong>
                    {message.role === "user"
                      ? "You"
                      : "Enterprise Consulting Agent"}
                  </strong>
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </article>
          ))}

          {loading && (
            <article className="chat-message-row assistant">
              <div className="avatar">AI</div>
              <div className="message-card">
                <div className="message-meta">
                  <strong>Enterprise Consulting Agent</strong>
                  <span>Thinking</span>
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </article>
          )}

          <div ref={bottomRef} />
        </div>

        <footer className="chat-composer">
          <textarea
            value={input}
            placeholder="Ask about cloud architecture, modernization, DevOps, MCP, RAG, or AI agents..."
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />

          <button onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </button>
        </footer>
      </main>
    </section>
  );
}
