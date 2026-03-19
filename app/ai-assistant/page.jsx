"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Card, Avatar, Skeleton, Typography, Space } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import { useRag } from "@/hooks/useRag";
import { useAuthStore } from "@/stores/authStore";
import ArticleContent from "@/components/articles/ArticleContent";

export default function AiAssistantPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const { loading, ask } = useRag();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => { if (!isAuthenticated) router.push("/signin"); }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    try {
      const data = await ask(question, conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: data?.answer || data?.content || "I couldn't find an answer.", sources: data?.sources || [] }]);
      if (data?.conversation_id) setConversationId(data.conversation_id);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, the AI service is currently unavailable." }]);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 200px)" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>AI Assistant</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Ask questions and get answers from community content.</p>
      <div style={{ flex: 1, overflow: "auto", marginBottom: 20 }}>
        {!messages.length && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <RobotOutlined style={{ fontSize: 48, color: "#2563eb", marginBottom: 16 }} />
            <Typography.Title level={4} style={{ color: "var(--text-primary)" }}>How can I help?</Typography.Title>
            <Typography.Text style={{ color: "var(--text-secondary)" }}>Ask anything — I search posts, questions, and discussions.</Typography.Text>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 20, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <Avatar size={32} style={{ background: msg.role === "user" ? "#2563eb" : "#e5873a", flexShrink: 0 }}>
              {msg.role === "user" ? (user?.name?.[0] || <UserOutlined />) : <RobotOutlined />}
            </Avatar>
            <Card style={{ borderRadius: 16, maxWidth: "75%", background: msg.role === "user" ? "rgba(37,99,235,0.08)" : "var(--nav-bg)" }}>
              <ArticleContent content={msg.content} />
              {msg.sources?.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-color)" }}>
                  <Typography.Text strong style={{ fontSize: 12 }}>Sources:</Typography.Text>
                  <Space direction="vertical" size={4} style={{ marginTop: 4 }}>
                    {msg.sources.map((s, j) => <a key={j} href={s.url || "#"} style={{ fontSize: 12, color: "#2563eb" }}>{s.title || s.content_type}</a>)}
                  </Space>
                </div>
              )}
            </Card>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 12 }}><Avatar size={32} style={{ background: "#e5873a" }}><RobotOutlined /></Avatar><Card style={{ borderRadius: 16 }}><Skeleton active paragraph={{ rows: 2 }} /></Card></div>}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Input size="large" placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)} onPressEnter={handleSend} style={{ borderRadius: 24, flex: 1 }} />
        <Button type="primary" shape="circle" size="large" icon={<SendOutlined />} onClick={handleSend} loading={loading} />
      </div>
    </div>
  );
}
