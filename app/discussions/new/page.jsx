"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Select, Space, message, Skeleton, Card } from "antd";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuthStore } from "@/stores/authStore";

const RichTextEditor = lazy(() => import("@/components/editor/RichTextEditor"));

export default function NewDiscussionPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { createDiscussion, fetchCategories } = useDiscussions();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    fetchCategories().then((d) => setCategories(d?.categories || []));
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) { message.warning("Title is required"); return; }
    if (!body.trim()) { message.warning("Body is required"); return; }
    if (!categoryId) { message.warning("Select a category"); return; }
    setSubmitting(true);
    try {
      const data = await createDiscussion({ title, body, category_id: categoryId });
      message.success("Discussion created!");
      router.push(`/discussions/${data.discussion?.slug || ""}`);
    } catch (err) { message.error(err?.error?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, color: "var(--text-primary)" }}>New Discussion</h1>
      <Card style={{ borderRadius: 16, marginBottom: 20 }}>
        <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block" }}>Category</label>
        <Select placeholder="Select category" style={{ width: "100%", marginBottom: 20 }} value={categoryId} onChange={setCategoryId}
          options={categories.map((c) => ({ label: c.name, value: c.id }))} />
        <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block" }}>Title</label>
        <Input size="large" placeholder="Discussion title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ borderRadius: 8, marginBottom: 20 }} />
        <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: "block" }}>Body</label>
        <Suspense fallback={<Skeleton active paragraph={{ rows: 6 }} />}>
          <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, overflow: "hidden" }}>
            <RichTextEditor content={body} onChange={setBody} placeholder="Start the discussion..." minHeight={200} />
          </div>
        </Suspense>
      </Card>
      <Space>
        <Button type="primary" shape="round" size="large" onClick={handleSubmit} loading={submitting}>Create Discussion</Button>
        <Button shape="round" size="large" onClick={() => router.back()}>Cancel</Button>
      </Space>
    </div>
  );
}
