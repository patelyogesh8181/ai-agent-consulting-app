import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../domain/models/ChatMessage";
import { container } from "../../app/container";
import { ChatStorage } from "../../infrastructure/storage/ChatStorage";
import "./ChatPage.css";
import type { ChatSession } from "../../domain/models/ChatSession";
import { ChatHistoryMenu } from "../../presentation/components/chat/ChatHistoryMenu";

const chatStorage = new ChatStorage();

const welcomeMessage = (): ChatMessage => ({
  id: crypto.randomUUID(),
  role: "assistant",
  content:
    "Hello. I am your Enterprise IT Consulting AI Agent. Ask me about enterprise architecture, cloud modernization, DevOps, AI agents, security, or solution design.",
  createdAt: new Date().toISOString(),
});

const createEmptySession = (): ChatSession => ({
  id: crypto.randomUUID(),
  title: "New Chat",
  isPinned: false,
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

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
    setOpenMenuId(null);
  };

  const openChat = (session: ChatSession) => {
    chatStorage.setActiveChatId(session.id);

    setActiveChatId(session.id);
    setMessages([...session.messages]); // create a new array reference
    setInput("");
    setOpenMenuId(null);
  };

  const pinChat = (sessionId: string) => {
    const updatedSessions = container.chatHistoryUseCase.pin(sessionId);

    setSessions([...updatedSessions]);

    setOpenMenuId(null);
  };

  const startRename = (session: ChatSession) => {
    setRenamingChatId(session.id);
    setRenameValue(session.title);
    setOpenMenuId(null);
  };

  const saveRename = (sessionId: string) => {
    const updatedSessions = container.chatHistoryUseCase.rename(
      sessionId,
      renameValue,
    );

    setSessions(updatedSessions);
    setRenamingChatId(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setRenamingChatId(null);
    setRenameValue("");
  };

  const deleteChat = (sessionId: string) => {
    const updatedSessions = container.chatHistoryUseCase.delete(sessionId);

    setSessions(updatedSessions);

    if (sessionId === activeChatId) {
      if (updatedSessions.length > 0) {
        const nextSession = updatedSessions[0];

        chatStorage.setActiveChatId(nextSession.id);
        setActiveChatId(nextSession.id);
        setMessages(nextSession.messages);
      } else {
        const newSession = chatStorage.createSession([welcomeMessage()]);

        setSessions(chatStorage.getSessions());
        setActiveChatId(newSession.id);
        setMessages(newSession.messages);
      }
    }

    setOpenMenuId(null);
  };

  return (
    <section className="enterprise-chat-page">
      <aside className="chat-sidebar">
        <button className="new-chat-button" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="sidebar-section">
          <h4>Recents</h4>

          <div className="chat-history-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={
                  session.id === activeChatId
                    ? "chat-history-row active-chat"
                    : "chat-history-row"
                }
              >
                {renamingChatId === session.id ? (
                  <div className="rename-box">
                    <input
                      value={renameValue}
                      autoFocus
                      onChange={(event) => setRenameValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          saveRename(session.id);
                        }

                        if (event.key === "Escape") {
                          cancelRename();
                        }
                      }}
                    />

                    <div className="rename-actions">
                      <button onClick={() => saveRename(session.id)}>
                        Save
                      </button>
                      <button onClick={cancelRename}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className="chat-history-content"
                      onClick={() => openChat(session)}
                    >
                      <span className="chat-title">
                        {session.isPinned ? "📌 " : ""}
                        {session.title}
                      </span>
                    </button>

                    <div className="history-menu-wrapper">
                      <button
                        className="history-more-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId(
                            openMenuId === session.id ? null : session.id,
                          );
                        }}
                        aria-label="Chat options"
                      >
                        ...
                      </button>

                      {openMenuId === session.id && (
                        <ChatHistoryMenu
                          isPinned={session.isPinned}
                          onPin={() => pinChat(session.id)}
                          onRename={() => startRename(session)}
                          onDelete={() => deleteChat(session.id)}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-conversation">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-message-row ${message.role}`}
            >
              <div className="avatar">
                {message.role === "user" ? "User" : "AI"}
              </div>

              <div className="message-card">
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
          <div className="composer-container">
            <textarea
              value={input}
              rows={1}
              placeholder="Message Enterprise AI Consultant..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              className="send-button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )}
            </button>
          </div>
        </footer>
      </main>
    </section>
  );
}
