"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Input, Button, Avatar, Typography, Skeleton, Popconfirm } from "antd";
import {
  SendOutlined, RobotOutlined, PlusOutlined,
  HistoryOutlined, DeleteOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import ArticleContent from "@/components/articles/ArticleContent";
import api from "@/services/api";
import { getDefaultAvatar, getRelativeTime } from "@/lib/utils";

const THINKING_MESSAGES = [
  "Searching the community knowledge base...",
  "Scanning posts, questions & discussions...",
  "Analyzing relevant content...",
  "Connecting the dots...",
  "Crafting your answer...",
];

export default function AiAssistantPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/health').catch(() => {});
    if (isAuthenticated) loadHistory();
  }, [isAuthenticated]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    setThinkingMsg(THINKING_MESSAGES[0]);
    const interval = setInterval(() => { i = (i + 1) % THINKING_MESSAGES.length; setThinkingMsg(THINKING_MESSAGES[i]); }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get('/rag/conversations');
      setHistory(res.data?.conversations || []);
    } catch { setHistory([]); }
    finally { setHistoryLoading(false); }
  }, []);

  const loadConversation = useCallback(async (id) => {
    try {
      const res = await api.get(`/rag/conversations/${id}`);
      const msgs = (res.data?.messages || []).map((m) => ({
        role: m.role,
        content: m.content,
        source: m.sources ? (JSON.parse(m.sources)?.[0] || null) : null,
      }));
      setMessages(msgs);
      setConversationId(id);
    } catch {}
  }, []);

  const deleteConversation = useCallback(async (id) => {
    try {
      await api.delete(`/rag/conversations/${id}`);
      setHistory((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
      }
    } catch {}
  }, [conversationId]);

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
  };

  const callRag = async (question, convId, retries = 2) => {
    const body = { question };
    if (convId) body.conversation_id = convId;
    try {
      const res = await api.post('/rag/ask', body);
      return res.data || res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 5000));
        return callRag(question, convId, retries - 1);
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
      const result = await callRag(question, conversationId);
      const answer = result?.answer || "I couldn't find an answer.";
      const sources = (result?.sources || []).filter(s => (s.similarity || 0) > 0.1);
      const bestSource = sources.length > 0 ? sources[0] : null;

      if (result?.conversation_id && !conversationId) {
        setConversationId(result.conversation_id);
        loadHistory();
      }

      setMessages((prev) => [...prev, { role: "assistant", content: answer, source: bestSource }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't connect to the AI service. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      {/* History Sidebar */}
      {isAuthenticated && showHistory && (
        <div style={{
          width: 280, minWidth: 280, borderRight: "1px solid var(--border-color)",
          display: "flex", flexDirection: "column", background: "var(--card-bg)",
        }}>
          <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
              <HistoryOutlined /> History
            </span>
            <Button type="primary" size="small" shape="round" icon={<PlusOutlined />} onClick={startNewChat}>New</Button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {historyLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 8px", color: "var(--text-secondary)", fontSize: 13 }}>
                No conversations yet
              </div>
            ) : (
              history.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  style={{
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4,
                    background: conversationId === conv.id ? "var(--bg-surface-hover, rgba(255,255,255,0.06))" : "transparent",
                    display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (conversationId !== conv.id) e.currentTarget.style.background = "var(--bg-surface-hover, rgba(255,255,255,0.04))"; }}
                  onMouseLeave={(e) => { if (conversationId !== conv.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {conv.title || "Untitled"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                      {getRelativeTime(conv.updated_at || conv.created_at)}
                    </div>
                  </div>
                  <Popconfirm title="Delete?" onConfirm={(e) => { e.stopPropagation(); deleteConversation(conv.id); }} okText="Delete" okButtonProps={{ danger: true }}>
                    <DeleteOutlined
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 12, color: "var(--text-secondary)", opacity: 0.5, padding: 4 }}
                    />
                  </Popconfirm>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border-color)" }}>
          {isAuthenticated && (
            <Button type="text" icon={showHistory ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} onClick={() => setShowHistory(!showHistory)} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
              <RobotOutlined style={{ color: "#e5873a" }} /> AI Assistant
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, margin: 0 }}>Powered by community knowledge</p>
          </div>
          {messages.length > 0 && (
            <Button shape="round" icon={<PlusOutlined />} onClick={startNewChat}>New Chat</Button>
          )}
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {!messages.length && (
            <div style={{ textAlign: "center", padding: "60px 16px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
              <Typography.Title level={4} style={{ color: "var(--text-primary)", margin: "0 0 8px" }}>What can I help you with?</Typography.Title>
              <Typography.Text style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                I search through community posts, questions, answers & discussions to find the best response.
              </Typography.Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
                {["How to solve two sum?", "Explain BFS algorithm", "Docker best practices", "What is dynamic programming?"].map((q) => (
                  <button key={q} onClick={() => setInput(q)} style={{
                    background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 20,
                    padding: "8px 16px", color: "var(--text-primary)", fontSize: 13, cursor: "pointer", transition: "border-color 0.2s",
                  }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#e5873a"}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
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
              <Avatar
                size={28}
                src={msg.role === "user" ? (user?.avatar || getDefaultAvatar(user?.username)) : undefined}
                style={{ background: msg.role === "user" ? "#2563eb" : "#e5873a", flexShrink: 0, fontSize: 12 }}
              >
                {msg.role === "assistant" && <RobotOutlined />}
              </Avatar>
              <div style={{
                maxWidth: "80%", borderRadius: 12, padding: "10px 14px",
                background: msg.role === "user" ? "rgba(37,99,235,0.1)" : "var(--card-bg)",
                border: msg.role === "user" ? "none" : "1px solid var(--border-color)",
              }}>
                <ArticleContent content={msg.content} />
                {msg.source && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border-color)" }}>
                    <a href={
                      msg.source.type === "post" ? `/post/${msg.source.slug}` :
                      msg.source.type === "discussion" || msg.source.type === "discussion_reply" ? `/discussions/${msg.source.slug}` :
                      `/questions/${msg.source.slug}`
                    } style={{ fontSize: 12, color: "#6db3f2", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      {msg.source.type === "discussion" || msg.source.type === "discussion_reply" ? "💬" : "📄"} {msg.source.title || "Source"} — by @{msg.source.author_username || ""}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
              <Avatar size={28} style={{ background: "#e5873a", flexShrink: 0, fontSize: 12 }}><RobotOutlined /></Avatar>
              <div style={{ borderRadius: 12, padding: "12px 16px", background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#e5873a", animation: `bounce 1.4s ease-in-out ${j * 0.2}s infinite` }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>{thinkingMsg}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--border-color)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          <Input size="large" placeholder="Ask anything..." value={input}
            onChange={(e) => setInput(e.target.value)} onPressEnter={handleSend}
            disabled={loading} style={{ borderRadius: 24, flex: 1 }} />
          <Button type="primary" shape="circle" size="large" icon={<SendOutlined />}
            onClick={handleSend} loading={loading} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
