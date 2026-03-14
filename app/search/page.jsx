"use client";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Segmented, Typography, Empty, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";
import ArticleCard from "@/components/articles/ArticleCard";

const { Title, Text } = Typography;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState("Relevant");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/posts/search", { params: { q: searchTerm } });
      const posts = (res.data || []).map(normalizePost).filter(Boolean);
      setResults(posts);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetchResults(query);
    } else {
      setResults([]);
    }
  }, [query, fetchResults]);

  const sorted = [...results].sort((a, b) => {
    if (sortBy === "Latest") return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (sortBy === "Popular") return b.likes - a.likes;
    return 0;
  });

  const handleSearch = useCallback((value) => {
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }, [router]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      {/* Search Bar */}
      <div style={{ maxWidth: 560, margin: "0 auto 40px" }}>
        <Input.Search
          placeholder="Search posts, tags, authors..."
          defaultValue={query}
          onSearch={handleSearch}
          size="large"
          enterButton
          style={{ borderRadius: 24 }}
          prefix={<SearchOutlined />}
        />
      </div>

      {query && (
        <>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}>
            <Text type="secondary">
              {loading ? "Searching..." : (
                <>{sorted.length} result{sorted.length !== 1 ? "s" : ""} for &ldquo;<Text strong>{query}</Text>&rdquo;</>
              )}
            </Text>
            <Segmented
              options={["Relevant", "Latest", "Popular"]}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <Spin size="large" />
            </div>
          ) : sorted.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}>
              {sorted.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Empty description="No articles found" style={{ padding: "64px 0" }} />
          )}
        </>
      )}

      {!query && (
        <Empty
          description={
            <div>
              <Title level={4} style={{ margin: "8px 0" }}>Search for articles</Title>
              <Text type="secondary">Find posts by title, topic, tag, or author</Text>
            </div>
          }
          style={{ padding: "64px 0" }}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 80 }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
