"use client";
import { useState, useEffect, useCallback } from "react";
import { Typography, Tag, Card, Space, Avatar, Spin } from "antd";
import { FireOutlined, ClockCircleOutlined, HeartOutlined } from "@ant-design/icons";
import ArticleCard from "@/components/articles/ArticleCard";
import { formatNumber } from "@/lib/utils";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";
import { MOCK_TAGS, MOCK_TRENDING, MOCK_POSTS, USE_MOCK } from "@/lib/mockData";

const { Title, Text, Paragraph } = Typography;

export default function ExplorePage() {
  const [activeTag, setActiveTag] = useState("All");
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Fetch tags on mount
  useEffect(() => {
    async function fetchTags() {
      if (USE_MOCK) { setTags(MOCK_TAGS); return; }
      try {
        const res = await api.get("/tags");
        if (res.success) {
          const tagList = Array.isArray(res.data) ? res.data : res.data?.tags || res.data?.data || [];
          setTags(tagList.length > 0 ? tagList : MOCK_TAGS);
        }
      } catch {
        setTags(MOCK_TAGS);
      }
    }
    fetchTags();
  }, []);

  // Fetch trending posts on mount
  useEffect(() => {
    async function fetchTrending() {
      if (USE_MOCK) { setTrendingPosts(MOCK_TRENDING); setTrendingLoading(false); return; }
      setTrendingLoading(true);
      try {
        const res = await api.get("/posts?sort=popular&limit=5");
        if (res.success) {
          const tPosts = res.data?.posts || res.data || [];
          const normalized = (Array.isArray(tPosts) ? tPosts : []).map(normalizePost).filter(Boolean);
          setTrendingPosts(normalized.length > 0 ? normalized : MOCK_TRENDING);
        } else { setTrendingPosts(MOCK_TRENDING); }
      } catch {
        setTrendingPosts(MOCK_TRENDING);
      }
      setTrendingLoading(false);
    }
    fetchTrending();
  }, []);

  // Fetch posts on mount and when tag changes
  const fetchPosts = useCallback(async (tagSlug) => {
    if (USE_MOCK) { setPosts(MOCK_POSTS); setLoading(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (tagSlug && tagSlug !== "All") params.set("tag", tagSlug);
      const res = await api.get(`/posts?${params.toString()}`);
      if (res.success) {
        const pList = res.data?.posts || res.data || [];
        const normalized = (Array.isArray(pList) ? pList : []).map(normalizePost).filter(Boolean);
        setPosts(normalized.length > 0 ? normalized : MOCK_POSTS);
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch {
      setPosts(MOCK_POSTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts(activeTag);
  }, [activeTag, fetchPosts]);

  const handleTagChange = useCallback((tagName) => {
    setActiveTag(tagName);
  }, []);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0 }}>Explore</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>Discover articles across topics that interest you</Text>
      </div>

      {/* Tag Filter */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 32,
        paddingBottom: 24,
        borderBottom: "1px solid var(--border-color)",
      }}>
        <Tag.CheckableTag
          checked={activeTag === "All"}
          onChange={() => handleTagChange("All")}
          style={{ borderRadius: 16, padding: "4px 16px", fontSize: 14 }}
        >
          All
        </Tag.CheckableTag>
        {tags.slice(0, 12).map((tag) => (
          <Tag.CheckableTag
            key={tag.slug}
            checked={activeTag === tag.name}
            onChange={() => handleTagChange(tag.name)}
            style={{ borderRadius: 16, padding: "4px 16px", fontSize: 14 }}
          >
            {tag.name}
          </Tag.CheckableTag>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: 40,
      }} className="explore-grid">
        {/* Main Content */}
        <div>
          {/* Trending Section */}
          <Card
            title={<Space><FireOutlined style={{ color: "#2563eb" }} /><span>Trending This Week</span></Space>}
            style={{ borderRadius: 16, marginBottom: 32 }}
          >
            {trendingLoading ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <Spin />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {trendingPosts.map((post, i) => (
                  <a
                    key={post.id}
                    href={`/post/${post.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      padding: "12px 8px",
                      borderRadius: 12,
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    className="trending-item"
                  >
                    <Text style={{ fontSize: 28, fontWeight: 800, opacity: 0.15, minWidth: 40, textAlign: "right" }}>
                      {String(i + 1).padStart(2, "0")}
                    </Text>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Text strong style={{ fontSize: 15, lineHeight: 1.4, display: "block" }}>
                        {post.title}
                      </Text>
                      <Space size={8} style={{ marginTop: 4 }}>
                        <Avatar src={post.author.avatar} size={20}>{post.author.name[0]}</Avatar>
                        <Text type="secondary" style={{ fontSize: 12 }}>{post.author.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {post.readTime}m
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <HeartOutlined /> {formatNumber(post.likes)}
                        </Text>
                      </Space>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </Card>

          {/* Filtered Articles */}
          <Title level={4} style={{ marginBottom: 20 }}>
            {activeTag === "All" ? "All Articles" : activeTag}
          </Title>
          {loading ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <Spin size="large" />
            </div>
          ) : posts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}>
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <Text type="secondary" style={{ fontSize: 16 }}>No articles found for &ldquo;{activeTag}&rdquo;</Text>
            </div>
          )}
        </div>

        {/* Tag Sidebar */}
        <div className="explore-sidebar">
          <div style={{ position: "sticky", top: 80 }}>
            <Card title="Browse by Topic" size="small" style={{ borderRadius: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {tags.map((tag) => (
                  <div
                    key={tag.slug}
                    onClick={() => handleTagChange(tag.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: activeTag === tag.name ? "rgba(37,99,235,0.1)" : "transparent",
                      transition: "background 0.2s",
                    }}
                  >
                    <Space size={8}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: tag.color }} />
                      <Text style={{ fontSize: 13, color: activeTag === tag.name ? "#2563eb" : undefined }}>
                        {tag.name}
                      </Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>{formatNumber(tag.post_count || tag.postCount)}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
