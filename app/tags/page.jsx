"use client";
import { useState, useEffect } from "react";
import { Card, Input, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTags } from "@/hooks/useTags";
import { MOCK_TAGS, USE_MOCK } from "@/lib/mockData";

export default function TagsPage() {
  const { fetchTags } = useTags();
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) { setTags(MOCK_TAGS); setLoading(false); return; }
    fetchTags()
      .then((d) => { const t = d?.tags || []; setTags(t.length > 0 ? t : MOCK_TAGS); })
      .catch(() => setTags(MOCK_TAGS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tags.filter((t) => (t.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Tags</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Browse topics across posts and questions.</p>
      <Input prefix={<SearchOutlined />} placeholder="Filter tags..." size="large" value={search}
        onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 400, borderRadius: 24, marginBottom: 24 }} />
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <Card key={i} style={{ borderRadius: 16 }}><Skeleton active paragraph={{ rows: 2 }} /></Card>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} style={{ textDecoration: "none" }}>
              <Card hoverable className="card-hover" style={{ borderRadius: 16, border: "1px solid var(--border-color)", background: "var(--card-bg)" }}>
                <span style={{
                  background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 20,
                  padding: "4px 12px", fontSize: 14, fontWeight: 600, display: "inline-block",
                }}>#{tag.name}</span>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "10px 0 0", lineHeight: 1.5, minHeight: 40 }}>{tag.description || "No description"}</p>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 10, display: "flex", gap: 12 }}>
                  <span>{tag.post_count || 0} posts</span>
                  <span>{tag.question_count || 0} questions</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
