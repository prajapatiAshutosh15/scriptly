"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Tag, Avatar, Typography, Button, Space, Skeleton } from "antd";
import { FireOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";

const { Text, Paragraph } = Typography;

export default function Sidebar() {
  const [tags, setTags] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tagsRes, postsRes] = await Promise.all([
          api.get("/tags").catch(() => ({ success: false })),
          api.get("/posts?sort=popular&limit=3").catch(() => ({ success: false })),
        ]);

        if (tagsRes.success) {
          const tagList = Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data?.data || [];
          setTags(tagList);
        }
        if (postsRes.success) {
          const postList = postsRes.data?.posts || postsRes.data || [];
          setFeaturedPosts((Array.isArray(postList) ? postList : []).map(normalizePost).filter(Boolean));
        }
      } catch {}
      setLoading(false);
    }
    loadData();
  }, []);

  const trendingTags = tags.slice(0, 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Trending Tags */}
      <Card
        title={<Space><FireOutlined style={{ color: "#2563eb" }} /><span>Trending Tags</span></Space>}
        size="small"
        style={{ borderRadius: 16 }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {trendingTags.length > 0 ? (
              trendingTags.map((tag) => (
                <Link key={tag.slug || tag.id} href={`/explore?tag=${tag.slug}`}>
                  <Tag color={tag.color} style={{ borderRadius: 12, cursor: "pointer", margin: 0, padding: "2px 10px" }}>
                    #{tag.name}
                  </Tag>
                </Link>
              ))
            ) : (
              <Text type="secondary" style={{ fontSize: 13 }}>No tags available</Text>
            )}
          </div>
        )}
      </Card>

      {/* Featured Posts */}
      <Card
        title={<Space><StarOutlined style={{ color: "#2563eb" }} /><span>Featured Posts</span></Space>}
        size="small"
        style={{ borderRadius: 16 }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, textDecoration: "none" }}
                >
                  <Avatar src={post.author?.avatar} size={36} style={{ background: "#2563eb" }}>
                    {post.author?.name?.[0] || "U"}
                  </Avatar>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Text strong style={{ fontSize: 13, lineHeight: 1.4, display: "block" }}>{post.title}</Text>
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 2 }}>{post.author?.name}</Text>
                  </div>
                </Link>
              ))
            ) : (
              <Text type="secondary" style={{ fontSize: 13 }}>No featured posts yet</Text>
            )}
          </div>
        )}
      </Card>

      {/* Community Card */}
      <Card
        style={{ borderRadius: 16, background: "linear-gradient(135deg, #2563eb 0%, #6366f1 100%)", border: "none" }}
        styles={{ body: { padding: 24 } }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Space>
            <TeamOutlined style={{ color: "#fff", fontSize: 18 }} />
            <Text strong style={{ color: "#fff", fontSize: 16 }}>Join the Community</Text>
          </Space>
          <Paragraph style={{ color: "rgba(219,234,254,0.85)", margin: 0, fontSize: 13 }}>
            Connect with 50,000+ developers sharing ideas and building together.
          </Paragraph>
          <Link href="/signin">
            <Button block size="large" style={{ marginTop: 4, background: "#fff", color: "#2563eb", border: "none", fontWeight: 600, borderRadius: 20 }}>
              Get Started — It&apos;s Free
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
