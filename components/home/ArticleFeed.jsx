"use client";
import { useState, useCallback, useEffect } from "react";
import { Button, Skeleton } from "antd";
import { HeartOutlined, FireOutlined, RocketOutlined } from "@ant-design/icons";
import FeedPost from "@/components/feed/FeedPost";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";
import { useAuthStore } from "@/stores/authStore";
import { MOCK_POSTS, USE_MOCK } from "@/lib/mockData";

const TABS = [
  { key: "following", label: "Following", icon: <HeartOutlined />, sort: "feed" },
  { key: "featured", label: "Featured", icon: <FireOutlined />, sort: "popular" },
  { key: "rising", label: "Rising", icon: <RocketOutlined />, sort: "latest" },
];

export default function ArticleFeed() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("featured");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (tab, pageNum) => {
    if (USE_MOCK) return { posts: MOCK_POSTS, hasMore: false };
    try {
      let endpoint;
      if (tab === "feed" && isAuthenticated) {
        endpoint = `/posts/feed?limit=12&page=${pageNum}`;
      } else {
        const sort = tab === "feed" ? "latest" : tab;
        endpoint = `/posts?limit=12&page=${pageNum}&sort=${sort}`;
      }
      const res = await api.get(endpoint);
      if (!res.success) return { posts: MOCK_POSTS, hasMore: false };
      const list = res.data?.posts || res.data || [];
      const normalized = (Array.isArray(list) ? list : []).map(normalizePost).filter(Boolean);
      return {
        posts: normalized.length > 0 ? normalized : MOCK_POSTS,
        hasMore: res.data?.pagination?.hasNext || false,
      };
    } catch {
      return { posts: MOCK_POSTS, hasMore: false };
    }
  }, [isAuthenticated]);

  // Load on mount and tab change
  useEffect(() => {
    setLoading(true);
    const tab = TABS.find((t) => t.key === activeTab);
    fetchPosts(tab?.sort || "popular", 1).then((result) => {
      setPosts(result.posts);
      setHasMore(result.hasMore);
      setPage(1);
      setLoading(false);
    });
  }, [activeTab, fetchPosts]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const tab = TABS.find((t) => t.key === activeTab);
    const result = await fetchPosts(tab?.sort || "popular", nextPage);
    setPosts((prev) => [...prev, ...result.posts]);
    setPage(nextPage);
    setHasMore(result.hasMore);
  }, [page, activeTab, fetchPosts]);

  return (
    <div>
      {/* Feed Tabs */}
      <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border-color, #2a2a2a)", marginBottom: 20 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <div key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "12px 0", cursor: "pointer", fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#e8e8e8" : "#888888",
                borderBottom: isActive ? "2px solid #e5873a" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
              {tab.icon} {tab.label}
            </div>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border-color)",
                padding: 20,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <Skeleton.Avatar active size={40} />
                <div style={{ flex: 1 }}>
                  <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 0 }} />
                </div>
              </div>
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {posts.map((post) => (
                <FeedPost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ fontSize: 18, marginBottom: 8 }}>No posts yet</p>
              <p style={{ fontSize: 14 }}>Be the first to share something!</p>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                shape="round"
                onClick={loadMore}
                style={{ borderColor: "#e5873a", color: "#e5873a" }}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
