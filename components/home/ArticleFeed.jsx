"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Skeleton } from "antd";
import { HeartOutlined, FireOutlined, RocketOutlined } from "@ant-design/icons";
import FeedPost from "@/components/feed/FeedPost";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";

const TABS = [
  { key: "feed", label: "Feed", icon: <HeartOutlined />, sort: "latest" },
  { key: "featured", label: "Featured", icon: <FireOutlined />, sort: "popular" },
  { key: "rising", label: "Rising", icon: <RocketOutlined />, sort: "latest" },
];

export default function ArticleFeed() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const bottomRef = useRef(null);

  const fetchPosts = useCallback(async (sort, pageNum) => {
    try {
      const res = await api.get(`/posts?limit=10&page=${pageNum}&sort=${sort}`);
      const list = res.data?.posts || res.data || [];
      const normalized = (Array.isArray(list) ? list : []).map(normalizePost).filter(Boolean);
      return {
        posts: normalized,
        hasMore: res.data?.pagination?.hasNext || false,
      };
    } catch {
      return { posts: [], hasMore: false };
    }
  }, []);

  // Load on mount and tab change
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    const tab = TABS.find((t) => t.key === activeTab);
    fetchPosts(tab?.sort || "latest", 1).then((result) => {
      setPosts(result.posts);
      setHasMore(result.hasMore);
      setPage(1);
      setLoading(false);
    });
  }, [activeTab, fetchPosts]);

  // Infinite scroll — load more when bottom is visible
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          const tab = TABS.find((t) => t.key === activeTab);
          fetchPosts(tab?.sort || "latest", nextPage).then((result) => {
            setPosts((prev) => [...prev, ...result.posts]);
            setPage(nextPage);
            setHasMore(result.hasMore);
            setLoadingMore(false);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, activeTab, fetchPosts]);

  return (
    <div>
      {/* Feed Tabs */}
      <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border-color)", marginBottom: 20 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <div key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "12px 0", cursor: "pointer", fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
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
            <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border-color)", padding: 20 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <Skeleton.Avatar active size={40} />
                <div style={{ flex: 1 }}><Skeleton active title={{ width: "40%" }} paragraph={{ rows: 0 }} /></div>
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
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No posts yet</p>
              <p style={{ fontSize: 14 }}>Be the first to share something!</p>
            </div>
          )}

          {/* Infinite scroll trigger */}
          {loadingMore && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ background: "var(--card-bg)", borderRadius: 12, border: "1px solid var(--border-color)", padding: 20 }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              ))}
            </div>
          )}
          <div ref={bottomRef} style={{ height: 1 }} />
        </>
      )}
    </div>
  );
}
