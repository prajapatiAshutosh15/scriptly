"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Avatar, Dropdown } from "antd";
import {
  HeartOutlined, HeartFilled, EyeOutlined, MessageOutlined,
  BookOutlined, BookFilled, EllipsisOutlined, CheckCircleFilled,
  ShareAltOutlined, FlagOutlined, LinkOutlined,
} from "@ant-design/icons";
import { getRelativeTime, formatNumber, getDefaultAvatar } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function FeedPost({ post }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);

  const handleLike = useCallback(async (e) => {
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
    } catch {}
  }, [liked, post.slug, isAuthenticated, router]);

  const handleBookmark = useCallback(async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/signin"); return; }
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/post/${post.id}`);
        setBookmarked(false);
      } else {
        await api.post(`/bookmarks/post/${post.id}`);
        setBookmarked(true);
      }
    } catch {}
  }, [bookmarked, post.id, isAuthenticated, router]);

  const moreItems = [
    { key: "share", icon: <ShareAltOutlined />, label: "Share" },
    { key: "copy", icon: <LinkOutlined />, label: "Copy link", onClick: () => navigator.clipboard?.writeText(`${window.location.origin}/post/${post.slug}`) },
    { key: "report", icon: <FlagOutlined />, label: "Report" },
  ];

  const isVerified = (post.author?.reputation || 0) > 1000;

  return (
    <article className="feed-post">
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <Link href={`/user/${post.author?.username || ""}`}>
          <Avatar src={post.author?.avatar || getDefaultAvatar(post.author?.username)} size={40} style={{ flexShrink: 0 }} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <Link href={`/user/${post.author?.username || ""}`} style={{ textDecoration: "none" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{post.author?.name}</span>
            </Link>
            {isVerified && <CheckCircleFilled style={{ color: "#e5873a", fontSize: 13 }} />}
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>@{post.author?.username}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>&middot; {getRelativeTime(post.publishedAt || post.createdAt)}</span>
          </div>
        </div>
        <Dropdown menu={{ items: moreItems }} trigger={["click"]} placement="bottomRight">
          <EllipsisOutlined style={{ color: "var(--text-secondary)", cursor: "pointer", fontSize: 18 }} />
        </Dropdown>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {(post.tags || []).slice(0, 4).map((tag) => (
            <Link key={tag.slug || tag.name} href={`/tags/${tag.slug}`} style={{ textDecoration: "none" }}>
              <span className="tech-tag">#{tag.name || tag}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <Link href={`/post/${post.slug}`} style={{ textDecoration: "none" }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4, transition: "color 0.2s" }}
          onMouseOver={(e) => e.currentTarget.style.color = "#58a6ff"}
          onMouseOut={(e) => e.currentTarget.style.color = "var(--text-primary)"}
        >
          {post.title}
        </h3>
      </Link>

      {/* Excerpt */}
      {post.excerpt && (
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.excerpt}
        </p>
      )}

      {/* Cover image (optional, smaller) */}
      {post.coverImage && (
        <Link href={`/post/${post.slug}`}>
          <img src={post.coverImage} alt="" className="feed-post-cover" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, marginTop: 12 }} />
        </Link>
      )}

      {/* Engagement bar */}
      <div className="engagement-bar" style={{
        display: "flex", alignItems: "center", gap: 20,
        marginTop: 16, paddingTop: 12,
        borderTop: "1px solid var(--border-color)",
      }}>
        <div onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: liked ? "#e5873a" : "var(--text-secondary)", transition: "color 0.2s" }}>
          {liked ? <HeartFilled /> : <HeartOutlined />}
          <span style={{ fontSize: 13, fontWeight: 500 }}>{formatNumber(likeCount)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
          <EyeOutlined />
          <span style={{ fontSize: 13 }}>{formatNumber(post.views || 0)}</span>
        </div>
        <Link href={`/post/${post.slug}#comments`} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", textDecoration: "none" }}>
          <MessageOutlined />
          <span style={{ fontSize: 13 }}>{post.comments || 0}</span>
        </Link>
        <div onClick={handleBookmark} style={{ marginLeft: "auto", cursor: "pointer", color: bookmarked ? "#e5873a" : "var(--text-secondary)", transition: "color 0.2s" }}>
          {bookmarked ? <BookFilled /> : <BookOutlined />}
        </div>
      </div>
    </article>
  );
}
