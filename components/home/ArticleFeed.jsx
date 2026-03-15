"use client";
import { useState, useCallback, useEffect } from "react";
import { Button, Segmented, Skeleton } from "antd";
import ArticleCard from "@/components/articles/ArticleCard";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";

const SORT_MAP = {
  Personalized: "",
  Latest: "latest",
  Best: "popular",
};

export default function ArticleFeed() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("Personalized");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (sort, pageNum) => {
    try {
      const params = new URLSearchParams({ limit: "12", page: String(pageNum) });
      if (sort) params.set("sort", sort);
      const res = await api.get(`/posts?${params.toString()}`);
      if (!res.success) return { posts: [], hasMore: false };
      const list = res.data?.posts || res.data || [];
      const normalized = (Array.isArray(list) ? list : []).map(normalizePost).filter(Boolean);
      const pagination = res.data?.pagination || {};
      return {
        posts: normalized,
        hasMore: pagination.hasNext || false,
      };
    } catch {
      return { posts: [], hasMore: false };
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    setLoading(true);
    fetchPosts("", 1).then((result) => {
      setPosts(result.posts);
      setHasMore(result.hasMore);
      setLoading(false);
    });
  }, [fetchPosts]);

  const handleSortChange = useCallback(async (val) => {
    setActiveTab(val);
    setLoading(true);
    const result = await fetchPosts(SORT_MAP[val], 1);
    setPosts(result.posts);
    setPage(1);
    setHasMore(result.hasMore);
    setLoading(false);
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const result = await fetchPosts(SORT_MAP[activeTab], nextPage);
    setPosts((prev) => [...prev, ...result.posts]);
    setPage(nextPage);
    setHasMore(result.hasMore);
  }, [page, activeTab, fetchPosts]);

  return (
    <div>
      {/* Tabs */}
      <div style={{ marginBottom: 24 }}>
        <Segmented
          options={["Personalized", "Latest", "Best"]}
          value={activeTab}
          onChange={handleSortChange}
          size="large"
        />
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <Skeleton.Image active style={{ width: "100%", height: 190 }} />
              <div style={{ padding: 20 }}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Post Grid */}
          {posts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}>
              {posts.map((post, i) => (
                <ArticleCard key={post.id} post={post} featured={i < 2} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No articles yet</p>
              <p style={{ fontSize: 14 }}>Be the first to write something!</p>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Button size="large" shape="round" onClick={loadMore}>
                Load More Articles
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
