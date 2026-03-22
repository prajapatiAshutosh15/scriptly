"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Card, Avatar, Typography } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import ArticleContent from "@/components/articles/ArticleContent";
import api from "@/services/api";

const THINKING_MESSAGES = [
  "Searching the community knowledge base...",
  "Scanning posts, questions & discussions...",
  "Analyzing relevant content...",
  "Connecting the dots...",
  "Crafting your answer...",
];

export default function AiAssistantPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    // Pre-wake backend (which wakes RAG on first request)
    api.get('/health').catch(() => {});
  }, []);

  // Auto-scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Cycle thinking messages
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    setThinkingMsg(THINKING_MESSAGES[0]);
    const interval = setInterval(() => {
      i = (i + 1) % THINKING_MESSAGES.length;
      setThinkingMsg(THINKING_MESSAGES[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const callRag = async (question, retries = 2) => {
    const body = { question };
    try {
      const res = await api.post('/rag/ask', body);
      return res.data || res;
    } catch (err) {
      if (retries > 0) {
        // Service might be waking up — wait and retry
        await new Promise(r => setTimeout(r, 5000));
        return callRag(question, retries - 1);
      }
      throw err;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const result = await callRag(question);
      const answer = result?.answer || "I couldn't find an answer.";
      const sources = (result?.sources || []).filter(s => (s.similarity || 0) > 0.1);
      const bestSource = sources.length > 0 ? sources[0] : null;

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: answer,
        source: bestSource,
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't connect to the AI service. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container" style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <RobotOutlined style={{ color: "#e5873a" }} /> AI Assistant
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: "4px 0 0" }}>Powered by community knowledge</p>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
        {!messages.length && (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
            <Typography.Title level={4} style={{ color: "var(--text-primary)", margin: "0 0 8px" }}>What can I help you with?</Typography.Title>
            <Typography.Text style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              I search through community posts, questions & answers to find the best response.
            </Typography.Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
              {["How to solve two sum?", "Explain BFS algorithm", "Docker best practices"].map((q) => (
                <button key={q} onClick={() => { setInput(q); }} style={{
                  background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20,
                  padding: "8px 16px", color: "var(--text-primary)", fontSize: 13, cursor: "pointer",
                }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, marginBottom: 16,
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-start",
          }}>
            <Avatar size={28} style={{
              background: msg.role === "user" ? "#2563eb" : "#e5873a",
              flexShrink: 0, fontSize: 12,
            }}>
              {msg.role === "user" ? (user?.name?.[0] || <UserOutlined />) : <RobotOutlined />}
            </Avatar>
            <div style={{
              maxWidth: "80%", borderRadius: 12, padding: "10px 14px",
              background: msg.role === "user" ? "rgba(37,99,235,0.1)" : "var(--card-bg)",
              border: msg.role === "user" ? "none" : "1px solid var(--border-color)",
            }}>
              <ArticleContent content={msg.content} />
              {msg.source && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border-color)" }}>
                  <a href={msg.source.type === "post" ? `/post/${msg.source.slug}` : `/questions/${msg.source.slug}`}
                    style={{ fontSize: 12, color: "#6db3f2", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                    📄 {msg.source.title || "Source"} — by @{msg.source.author_username || ""}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking animation */}
        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
            <Avatar size={28} style={{ background: "#e5873a", flexShrink: 0, fontSize: 12 }}><RobotOutlined /></Avatar>
            <div style={{
              borderRadius: 12, padding: "12px 16px",
              background: "var(--card-bg)", border: "1px solid var(--border-color)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#e5873a",
                      animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>
                  {thinkingMsg}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 0",
        borderTop: "1px solid var(--border-color)",
      }}>
        <Input size="large" placeholder="Ask anything..." value={input}
          onChange={(e) => setInput(e.target.value)} onPressEnter={handleSend}
          disabled={loading} style={{ borderRadius: 24, flex: 1 }} />
        <Button type="primary" shape="circle" size="large" icon={<SendOutlined />}
          onClick={handleSend} loading={loading} />
      </div>

      {/* CSS for bounce animation */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
