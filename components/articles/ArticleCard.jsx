"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Card, Avatar, Space, Typography, message, Tooltip } from "antd";
import { HeartOutlined, HeartFilled, MessageOutlined, ClockCircleOutlined, BookOutlined, BookFilled } from "@ant-design/icons";
import { getRelativeTime, getDefaultCover } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const { Text, Paragraph } = Typography;

const ArticleCard = ({ post, featured = false }) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);

  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) { router.push("/signin"); return; }
    try {
      if (liked) {
        await api.delete(`/posts/${post.slug}/like`);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await api.post(`/posts/${post.slug}/like`);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch { message.error("Failed"); }
  }, [liked, post.slug, isAuthenticated, router]);

  const handleBookmark = useCallback(async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) { router.push("/signin"); return; }
    try {
      if (bookmarked) {
        await api.delete(`/posts/${post.slug}/bookmark`);
        setBookmarked(false);
        message.success("Removed from bookmarks");
      } else {
        await api.post(`/posts/${post.slug}/bookmark`);
        setBookmarked(true);
        message.success("Bookmarked!");
      }
    } catch { message.error("Failed"); }
  }, [bookmarked, post.slug, isAuthenticated, router]);

  return (
    <Card
      hoverable
      cover={
        <Link href={`/post/${post.slug}`}>
          <div style={{ overflow: "hidden", height: featured ? 220 : 190, position: "relative" }}>
            <img
              src={post.coverImage || getDefaultCover(post.slug || post.id)}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onError={(e) => { e.currentTarget.src = getDefaultCover(); }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)",
              pointerEvents: "none",
            }} />
          </div>
        </Link>
      }
      styles={{ body: { padding: 20 } }}
      className="card-hover"
      style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-color)", background: "var(--card-bg, transparent)" }}
    >
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <Space size={4} wrap style={{ marginBottom: 12 }}>
          {post.tags.slice(0, 3).map((tag) => (
            <Link key={tag.id || tag.slug || tag} href={`/explore?tag=${tag.slug || tag}`}>
              <span style={{
                background: "rgba(37,99,235,0.1)",
                color: "#2563eb",
                borderRadius: 20,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-block",
                transition: "background 0.2s",
              }}>
                {tag.name || tag}
              </span>
            </Link>
          ))}
        </Space>
      )}

      {/* Title */}
      <Link href={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
        <Paragraph
          strong
          className="article-card-title"
          style={{ fontSize: featured ? 18 : 16, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: "var(--text-primary)", transition: "color 0.2s" }}
          ellipsis={{ rows: 2 }}
        >
          {post.title}
        </Paragraph>
      </Link>

      {/* Excerpt */}
      <Paragraph style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 16, color: "var(--text-secondary)" }} ellipsis={{ rows: 2 }}>
        {post.excerpt}
      </Paragraph>

      {/* Author & Meta */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingTop: 14,
        borderTop: "1px solid var(--border-color)",
      }}>
        <Link href={`/user/${post.author?.username || ''}`}>
          <Avatar src={post.author?.avatar} size={34} style={{ background: "#2563eb" }}>
            {post.author?.name?.[0] || "U"}
          </Avatar>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/user/${post.author?.username || ''}`} style={{ textDecoration: "none" }}>
            <Text strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
              {post.author?.name || "Unknown"}
            </Text>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <Text type="secondary" style={{ fontSize: 12 }} suppressHydrationWarning>
              {getRelativeTime(post.publishedAt)}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> {post.readTime || 1}m
            </Text>
          </div>
        </div>

        {/* Interactive Buttons */}
        <Space size={4}>
          <Tooltip title={liked ? "Unlike" : "Like"}>
            <span
              onClick={handleLike}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: liked ? "#ef4444" : "var(--text-secondary)",
                padding: "4px 8px",
                borderRadius: 8,
                transition: "all 0.2s",
              }}
            >
              {liked ? <HeartFilled /> : <HeartOutlined />} {likeCount}
            </span>
          </Tooltip>

          <Tooltip title="Comments">
            <Link href={`/post/${post.slug}#comments`} style={{ textDecoration: "none" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: "var(--text-secondary)",
                padding: "4px 8px",
                borderRadius: 8,
              }}>
                <MessageOutlined /> {post.comments || 0}
              </span>
            </Link>
          </Tooltip>

          <Tooltip title={bookmarked ? "Remove bookmark" : "Bookmark"}>
            <span
              onClick={handleBookmark}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                fontSize: 14,
                color: bookmarked ? "#2563eb" : "var(--text-secondary)",
                padding: "4px 6px",
                borderRadius: 8,
                transition: "all 0.2s",
              }}
            >
              {bookmarked ? <BookFilled /> : <BookOutlined />}
            </span>
          </Tooltip>
        </Space>
      </div>
    </Card>
  );
};

export default ArticleCard;
