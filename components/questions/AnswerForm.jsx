"use client";
import { useState, lazy, Suspense } from "react";
import { Button, Skeleton, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

const RichTextEditor = lazy(() => import("@/components/editor/RichTextEditor"));

export default function AnswerForm({ onSubmit }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim() || body.length < 20) { message.warning("Answer must be at least 20 characters"); return; }
    setSubmitting(true);
    try {
      await onSubmit({ body });
      setBody("");
      message.success("Answer posted!");
    } catch (err) {
      message.error(err?.error?.message || "Failed to post answer");
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Your Answer</h3>
      <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
        <div style={{
          border: "1px solid var(--border-color)", borderRadius: 16,
          overflow: "hidden", marginBottom: 16,
          transition: "border-color 0.2s",
        }}>
          <RichTextEditor content={body} onChange={setBody} placeholder="Write your answer..." minHeight={200} />
        </div>
      </Suspense>
      <Button type="primary" shape="round" size="large" icon={<SendOutlined />} onClick={handleSubmit} loading={submitting}>
        Post Your Answer
      </Button>
    </div>
  );
}
