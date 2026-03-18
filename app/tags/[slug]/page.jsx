"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tag, Skeleton, Button, Segmented } from "antd";
import ArticleCard from "@/components/articles/ArticleCard";
import QuestionCard from "@/components/questions/QuestionCard";
import EmptyState from "@/components/shared/EmptyState";
import { useTags } from "@/hooks/useTags";
import { normalizePost, normalizeQuestion } from "@/lib/normalizers";

export default function TagDetailPage() {
  const { slug } = useParams();
  const { fetchTags } = useTags();
  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => { loadTag(); }, [slug]);

  const loadTag = async () => {
    setLoading(true);
    try {
      const api = (await import("@/services/api")).default;
      const tagRes = await api.get(`/tags/${slug}`);
      setTag(tagRes.data?.tag);
      const postsRes = await api.get(`/tags/${slug}/posts`, { params: { limit: 20 } });
      setPosts(postsRes.data?.posts || []);
    } catch {}
    finally { setLoading(false); }
  };

  if (loading) return <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}><Skeleton active paragraph={{ rows: 10 }} /></div>;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Tag color={tag?.color} style={{ borderRadius: 12, fontSize: 18, fontWeight: 700, padding: "4px 16px" }}>{tag?.name}</Tag>
        {tag?.description && <p style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: 14 }}>{tag.description}</p>}
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
          <span>{tag?.post_count || 0} posts</span>
          <span>{tag?.question_count || 0} questions</span>
          <span>{tag?.follower_count || 0} followers</span>
        </div>
      </div>

      <Segmented options={[
        { label: "Posts", value: "posts" },
        { label: "Questions", value: "questions" },
      ]} value={activeTab} onChange={setActiveTab} style={{ marginBottom: 20 }} />

      {activeTab === "posts" && (
        posts.length === 0 ? <EmptyState icon="📝" title="No posts with this tag" /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {posts.map((p) => <ArticleCard key={p.id} post={normalizePost(p)} />)}
          </div>
        )
      )}

      {activeTab === "questions" && (
        <EmptyState icon="❓" title="Questions coming soon" description="Filter questions by this tag on the Questions page." />
      )}
    </div>
  );
}
