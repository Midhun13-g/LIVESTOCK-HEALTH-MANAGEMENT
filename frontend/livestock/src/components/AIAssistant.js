import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import api from "../api";
import "./AIAssistant.css";

/* ─── constants ─────────────────────────────── */
const LS_KEY = "cooper_messages";

const SUGGESTIONS = [
  "What are signs of Foot and Mouth Disease?",
  "How do I prevent Avian Influenza?",
  "My cow has a fever, what should I do?",
  "Best vaccination schedule for cattle?",
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const getTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

/* ─── MessageBubble (reusable) ───────────────── */
const MessageBubble = ({ message }) => {
  const isBot = message.sender === "bot";
  return (
    <div className={`ai-msg-row ${isBot ? "bot" : "user"}`}>
      <div className="ai-msg-group">
        <div className="ai-msg-icon">{isBot ? "🤖" : "👤"}</div>
        <div className="ai-msg-content">
          <span className="ai-msg-name">{isBot ? "Cooper" : "You"}</span>
          <div className="ai-bubble">
            {isBot
              ? <ReactMarkdown>{message.text}</ReactMarkdown>
              : message.text
            }
          </div>
          {message.time && (
            <span className="ai-msg-time">{message.time}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── TypingIndicator ────────────────────────── */
const TypingIndicator = () => (
  <div className="ai-typing-row">
    <div className="ai-typing-group">
      <div className="ai-msg-icon" style={{ background: "linear-gradient(135deg,#10a37f,#0d8a6b)" }}>🤖</div>
      <div className="ai-typing-bubble">
        <span /><span /><span />
      </div>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────── */
const AIAssistant = () => {
  const [messages, setMessages] = useState(() => {
    /* Load from localStorage on first render — survives navigation */
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef(null);

  /* Sync server history once on mount (only if localStorage is empty) */
  useEffect(() => {
    if (messages.length === 0) {
      api.get("/chatbot/history").then((res) => {
        const history = res.data.history.map((h) => ({
          id:     uid(),
          sender: (h.role === "model" || h.role === "bot") ? "bot" : "user",
          text:   Array.isArray(h.parts) ? h.parts[0] : (h.parts || ""),
          time:   "",
        }));
        if (history.length > 0) {
          setMessages(history);
        }
      }).catch(() => {});
    }
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Persist to localStorage whenever messages change */
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(LS_KEY, JSON.stringify(messages));
    }
  }, [messages, hydrated]);

  /* Auto-scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { id: uid(), sender: "user", text: msg, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/chatbot/chat", { message: msg });
      const botMsg = { id: uid(), sender: "bot", text: res.data.response, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setError("Failed to connect to Cooper. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleClear = async () => {
    try { await api.delete("/chatbot/history"); } catch {}
    setMessages([]);
    localStorage.removeItem(LS_KEY);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-page">

      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-avatar">🤖</div>
          <div className="ai-header-info">
            <h2>Cooper</h2>
            <p><span className="ai-online-dot" /> Online · Livestock AI Assistant</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="ai-clear-btn" onClick={handleClear}>
            🗑 Clear Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="ai-messages">

        {/* Welcome / empty state */}
        {messages.length === 0 && !loading && (
          <div className="ai-empty">
            <div className="ai-empty-logo">🐾</div>
            <h3>How can I help you today?</h3>
            <p>I'm Cooper, your AI-powered livestock health assistant. Ask me anything about animal health, diseases, or care.</p>
            <div className="ai-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="ai-suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render messages using stable id as key */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {loading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {error && <div className="ai-error">{error}</div>}

      {/* Input bar */}
      <div className="ai-input-bar">
        <input
          className="ai-input"
          type="text"
          placeholder="Message Cooper..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        <button
          className="ai-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          title="Send"
        >
          ➤
        </button>
      </div>

    </div>
  );
};

export default AIAssistant;
