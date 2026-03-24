"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Segmented, Typography, Card, Avatar, Tag, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import ArticleCard from "@/components/articles/ArticleCard";
import QuestionCard from "@/components/questions/QuestionCard";
import EmptyState from "@/components/shared/EmptyState";
import { normalizePost, normalizeQuestion } from "@/lib/normalizers";
import { getDefaultAvatar } from "@/lib/utils";

const { Text } = Typography;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const { loading, search } = useSearch();
  const [results, setResults] = useState({});
  const [activeType, setActiveType] = useState("");

  useEffect(() => {
    if (query.length >= 2) {
      search(query, { type: activeType || undefined }).then((data) => setResults(data || {}));
    } else {
      setResults({});
    }
  }, [query, activeType]);

  const handleSearch = (value) => {
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const types = [
    { label: "All", value: "" },
    { label: "Posts", value: "post" },
    { label: "Questions", value: "question" },
    { label: "Discussions", value: "discussion" },
    { label: "Users", value: "user" },
  ];

  const posts = results.posts || [];
  const questions = results.questions || [];
  const discussions = results.discussions || [];
  const users = results.users || [];
  const totalResults = posts.length + questions.length + discussions.length + users.length;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto 40px" }}>
        <Input.Search placeholder="Search posts, questions, discussions, users..." defaultValue={query}
          onSearch={handleSearch} size="large" enterButton style={{ borderRadius: 24 }} prefix={<SearchOutlined />} />
      </div>

      {query && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <Text type="secondary">
              {loading ? "Searching..." : <>{totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;<Text strong>{query}</Text>&rdquo;</>}
            </Text>
            <Segmented options={types} value={activeType} onChange={setActiveType} />
          </div>

          {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : totalResults === 0 ? (
            <EmptyState icon="🔍" title="No results found" description="Try different keywords" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Posts */}
              {posts.length > 0 && (!activeType || activeType === "post") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>Posts ({posts.length})</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {posts.map((p) => <ArticleCard key={p.id} post={normalizePost(p)} />)}
                  </div>
                </div>
              )}

              {/* Questions */}
              {questions.length > 0 && (!activeType || activeType === "question") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>Questions ({questions.length})</h3>
                  <div style={{ background: "var(--nav-bg)", borderRadius: 16, border: "1px solid var(--border-color)", overflow: "hidden" }}>
                    {questions.map((q) => <QuestionCard key={q.id} question={normalizeQuestion(q)} />)}
                  </div>
                </div>
              )}

              {/* Discussions */}
              {discussions.length > 0 && (!activeType || activeType === "discussion") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>Discussions ({discussions.length})</h3>
                  {discussions.map((d) => (
                    <Link key={d.id} href={`/discussions/${d.slug || ""}`} style={{ textDecoration: "none" }}>
                      <Card hoverable style={{ borderRadius: 16, marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>{d.title}</div>
                        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{d.replies_count || 0} replies · by @{d.author_username || ""}</div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Users */}
              {users.length > 0 && (!activeType || activeType === "user") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>Users ({users.length})</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
                    {users.map((u) => (
                      <Link key={u.id} href={`/user/${u.username || ""}`} style={{ textDecoration: "none" }}>
                        <Card hoverable style={{ borderRadius: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar src={u.avatar || getDefaultAvatar(u.username)} size={40} />
                            <div>
                              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.name || "Unknown"}</div>
                              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>@{u.username || ""} · {u.reputation || 0} rep</div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!query && <EmptyState icon="🔍" title="Search for anything" description="Find posts, questions, discussions, and users" />}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 80 }}><Skeleton active paragraph={{ rows: 6 }} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
