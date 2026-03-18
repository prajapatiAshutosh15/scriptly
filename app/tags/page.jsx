"use client";
import { useState, useEffect } from "react";
import { Card, Tag, Input, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTags } from "@/hooks/useTags";

export default function TagsPage() {
  const { fetchTags } = useTags();
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTags().then((d) => { setTags(d?.tags || []); setLoading(false); }); }, []);

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Tags</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Browse topics across posts and questions.</p>
      <Input prefix={<SearchOutlined />} placeholder="Filter tags..." size="large" value={search}
        onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 400, borderRadius: 24, marginBottom: 24 }} />
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} style={{ textDecoration: "none" }}>
              <Card hoverable style={{ borderRadius: 16 }}>
                <Tag color={tag.color} style={{ borderRadius: 12, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{tag.name}</Tag>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "8px 0 0", lineHeight: 1.4, minHeight: 36 }}>{tag.description || "No description"}</p>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>{tag.post_count || 0} posts · {tag.question_count || 0} questions</div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
