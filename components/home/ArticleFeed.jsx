"use client";
import { useState, useCallback } from "react";
import { Button, Segmented, Spin } from "antd";
import ArticleCard from "@/components/articles/ArticleCard";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";

const SORT_MAP = {
  Personalized: "",
  Latest: "latest",
  Best: "popular",
};

export default function ArticleFeed({ initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTab, setActiveTab] = useState("Personalized");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 6);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (sort, pageNum) => {
    try {
      const params = new URLSearchParams({ limit: "6", page: String(pageNum) });
      if (sort) params.set("sort", sort);
      const res = await api.get(`/posts?${params.toString()}`);
      if (!res.success) return { posts: [], hasMore: false };
      const normalized = (res.data || []).map(normalizePost).filter(Boolean);
      const pagination = res.pagination || {};
      return {
        posts: normalized,
        hasMore: pagination.page < pagination.pages,
      };
    } catch {
      return { posts: [], hasMore: false };
    }
  }, []);

  const handleSortChange = useCallback(async (val) => {
    setActiveTab(val);
    setLoading(true);
    const sort = SORT_MAP[val];
    const result = await fetchPosts(sort, 1);
    setPosts(result.posts);
    setPage(1);
    setHasMore(result.hasMore);
    setLoading(false);
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    const nextPage = page + 1;
    const sort = SORT_MAP[activeTab];
    const result = await fetchPosts(sort, nextPage);
    setPosts((prev) => [...prev, ...result.posts]);
    setPage(nextPage);
    setHasMore(result.hasMore);
    setLoading(false);
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

      {/* Post Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 24,
      }}>
        {posts.map((post, i) => (
          <ArticleCard key={post.id} post={post} featured={i < 2} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Button
            size="large"
            shape="round"
            loading={loading}
            onClick={loadMore}
          >
            Load More Articles
          </Button>
        </div>
      )}

      {loading && !hasMore && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Spin />
        </div>
      )}
    </div>
  );
}
