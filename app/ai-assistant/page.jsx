"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Card, Avatar, Skeleton, Typography, Space } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import ArticleContent from "@/components/articles/ArticleContent";
import api from "@/services/api";

export default function AiAssistantPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => { if (!isAuthenticated) router.push("/signin"); }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const body = { question };
      if (conversationId) body.conversation_id = conversationId;

      // Call API directly instead of through hook to catch exact error
      const res = await api.post('/rag/ask', body);

      // api.js interceptor returns response.data = { success, data, message }
      const result = res.data || res;
      const answer = result?.answer || result?.content || "I couldn't find an answer.";
      const sources = result?.sources || [];

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: answer,
        sources: sources.filter(s => s.similarity > 0.05),
      }]);

      if (result?.conversation_id) setConversationId(result.conversation_id);
    } catch (err) {
      console.error("[AI Assistant] Error:", err);
      const errorMsg = err?.message || err?.error?.message || "Unknown error";
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `Error: ${errorMsg}\n\nPlease try logging out and back in, or check if the backend is running.`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 200px)" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>AI Assistant</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Ask questions and get answers from community content.</p>
      <div style={{ flex: 1, overflow: "auto", marginBottom: 20 }}>
        {!messages.length && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <RobotOutlined style={{ fontSize: 48, color: "#e5873a", marginBottom: 16 }} />
            <Typography.Title level={4} style={{ color: "var(--text-primary)" }}>How can I help?</Typography.Title>
            <Typography.Text style={{ color: "var(--text-secondary)" }}>Ask anything — I search posts, questions, and discussions from the community.</Typography.Text>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 20, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <Avatar size={32} style={{ background: msg.role === "user" ? "#2563eb" : "#e5873a", flexShrink: 0 }}>
              {msg.role === "user" ? (user?.name?.[0] || <UserOutlined />) : <RobotOutlined />}
            </Avatar>
            <Card style={{ borderRadius: 16, maxWidth: "75%", background: msg.role === "user" ? "rgba(37,99,235,0.08)" : "var(--card-bg)" }}>
              <ArticleContent content={msg.content} />
              {msg.sources?.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-color)" }}>
                  <Typography.Text strong style={{ fontSize: 12, color: "var(--text-secondary)" }}>Sources:</Typography.Text>
                  <Space direction="vertical" size={4} style={{ marginTop: 4 }}>
                    {msg.sources.map((s, j) => {
                      const href = s.type === "post" ? `/post/${s.slug}` : s.type === "question" ? `/questions/${s.slug}` : "#";
                      return <a key={j} href={href} style={{ fontSize: 12, color: "#6db3f2" }}>[{s.type || "source"}] {s.title || "Untitled"} by @{s.author_username || ""} ({Math.round((s.similarity || 0) * 100)}% match)</a>;
                    })}
                  </Space>
                </div>
              )}
            </Card>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12 }}>
            <Avatar size={32} style={{ background: "#e5873a" }}><RobotOutlined /></Avatar>
            <Card style={{ borderRadius: 16, background: "var(--card-bg)" }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Input size="large" placeholder="Ask a question..." value={input}
          onChange={(e) => setInput(e.target.value)} onPressEnter={handleSend}
          disabled={loading} style={{ borderRadius: 24, flex: 1 }} />
        <Button type="primary" shape="circle" size="large" icon={<SendOutlined />}
          onClick={handleSend} loading={loading} />
      </div>
    </div>
  );
}
