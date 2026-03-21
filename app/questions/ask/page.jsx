"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Select, Space, message, Skeleton, Card } from "antd";
import { useQuestions } from "@/hooks/useQuestions";
import { useTags } from "@/hooks/useTags";
import { useAuthStore } from "@/stores/authStore";

const RichTextEditor = lazy(() => import("@/components/editor/RichTextEditor"));

export default function AskQuestionPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { createQuestion } = useQuestions();
  const { fetchTags } = useTags();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    fetchTags().then((data) => setTags(data?.tags || []));
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || title.length < 10) { message.warning("Title must be at least 10 characters"); return; }
    if (!body.trim() || body.length < 20) { message.warning("Body must be at least 20 characters"); return; }
    setSubmitting(true);
    try {
      const existingTagIds = [];
      const customTagNames = [];
      selectedTags.forEach((name) => {
        const found = tags.find((t) => (t.name || "").toLowerCase() === name.toLowerCase());
        if (found) existingTagIds.push(found.id);
        else customTagNames.push(name);
      });
      const data = await createQuestion({ title, body, tags: existingTagIds, custom_tags: customTagNames });
      message.success("Question posted!");
      router.push(`/questions/${data.question?.slug || ""}`);
    } catch (err) {
      message.error(err?.error?.message || "Failed to post question");
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Ask a Question</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Be specific and include details so the community can help.</p>
      <Card style={{ borderRadius: 16, marginBottom: 20 }}>
        <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block", color: "var(--text-primary)" }}>Title</label>
        <Input size="large" placeholder="What's your question? Be specific." value={title}
          onChange={(e) => setTitle(e.target.value)} style={{ borderRadius: 8, marginBottom: 20 }} maxLength={300} showCount />
        <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block", color: "var(--text-primary)" }}>Body</label>
        <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
            <RichTextEditor content={body} onChange={setBody} placeholder="Describe your question in detail..." minHeight={250} />
          </div>
        </Suspense>
        <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block", color: "var(--text-primary)" }}>Tags (up to 5)</label>
        <Select mode="tags" placeholder="Type to add tags (up to 5)" maxCount={5} style={{ width: "100%" }}
          tokenSeparators={[","]}
          value={selectedTags} onChange={setSelectedTags}
          options={tags.map((t) => ({ label: t.name, value: t.name }))} />
      </Card>
      <Space>
        <Button type="primary" shape="round" size="large" onClick={handleSubmit} loading={submitting}>Post Question</Button>
        <Button shape="round" size="large" onClick={() => router.back()}>Cancel</Button>
      </Space>
    </div>
  );
}
