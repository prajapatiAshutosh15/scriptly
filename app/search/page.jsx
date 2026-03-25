"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Segmented, Typography, Card, Avatar, Tag, Skeleton } from "antd";
import {
  SearchOutlined, FileTextOutlined, QuestionCircleOutlined,
  MessageOutlined, TagOutlined, UserOutlined, CheckCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import ArticleCard from "@/components/articles/ArticleCard";
import EmptyState from "@/components/shared/EmptyState";
import { normalizePost, normalizeQuestion } from "@/lib/normalizers";
import { getDefaultAvatar, formatRelativeTime } from "@/lib/utils";

const { Text } = Typography;

function Snippet({ html }) {
  if (!html) return null;
  return (
    <span
      className="search-results"
      style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

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
    { label: "Answers", value: "answer" },
    { label: "Discussions", value: "discussion" },
    { label: "Tags", value: "tag" },
    { label: "Users", value: "user" },
  ];

  const posts = results.posts || [];
  const questions = results.questions || [];
  const answers = results.answers || [];
  const discussions = results.discussions || [];
  const tags = results.tags || [];
  const users = results.users || [];
  const totalResults = posts.length + questions.length + answers.length + discussions.length + tags.length + users.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto 40px" }}>
        <Input.Search placeholder="Search posts, questions, tags, users..." defaultValue={query}
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
            <EmptyState icon="🔍" title="No results found" description="Try different keywords or check for typos" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Posts */}
              {posts.length > 0 && (!activeType || activeType === "post") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <FileTextOutlined style={{ color: "#2563eb" }} /> Posts ({posts.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {posts.map((p) => (
                      <Link key={p.id} href={`/post/${p.slug}`} style={{ textDecoration: "none" }}>
                        <Card hoverable size="small" style={{ borderRadius: 12 }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <Avatar src={p.author_avatar || getDefaultAvatar(p.author_username)} size={32} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{p.title}</div>
                              {p.snippet && <Snippet html={p.snippet} />}
                              <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                                <span>@{p.author_username}</span>
                                <span>{p.likes_count || 0} likes</span>
                                <span>{p.comments_count || 0} comments</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {questions.length > 0 && (!activeType || activeType === "question") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <QuestionCircleOutlined style={{ color: "#22c55e" }} /> Questions ({questions.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {questions.map((q) => (
                      <Link key={q.id} href={`/questions/${q.slug}`} style={{ textDecoration: "none" }}>
                        <Card hoverable size="small" style={{ borderRadius: 12 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{q.title}</div>
                          {q.snippet && <Snippet html={q.snippet} />}
                          <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                            <span>{q.votes_count || 0} votes</span>
                            <span>{q.answers_count || 0} answers</span>
                            {q.is_answered && <span style={{ color: "#22c55e" }}><CheckCircleFilled /> Answered</span>}
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Answers */}
              {answers.length > 0 && (!activeType || activeType === "answer") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageOutlined style={{ color: "#f59e0b" }} /> Answers ({answers.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {answers.map((a) => (
                      <Link key={a.id} href={`/questions/${a.question_slug}`} style={{ textDecoration: "none" }}>
                        <Card hoverable size="small" style={{ borderRadius: 12 }}>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                            Answer to: <span style={{ fontWeight: 600 }}>{a.question_title}</span>
                          </div>
                          {a.snippet && <Snippet html={a.snippet} />}
                          <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                            <span>@{a.author_username}</span>
                            <span>{a.votes_count || 0} votes</span>
                            {a.is_accepted && <span style={{ color: "#22c55e" }}><CheckCircleFilled /> Accepted</span>}
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussions */}
              {discussions.length > 0 && (!activeType || activeType === "discussion") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageOutlined style={{ color: "#8b5cf6" }} /> Discussions ({discussions.length})
                  </h3>
                  {discussions.map((d) => (
                    <Link key={d.id} href={`/discussions/${d.slug || ""}`} style={{ textDecoration: "none" }}>
                      <Card hoverable size="small" style={{ borderRadius: 12, marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{d.title}</div>
                        {d.snippet && <Snippet html={d.snippet} />}
                        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
                          {d.replies_count || 0} replies · @{d.author_username || ""}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (!activeType || activeType === "tag") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <TagOutlined style={{ color: "#e5873a" }} /> Tags ({tags.length})
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {tags.map((t) => (
                      <Link key={t.id} href={`/tags/${t.slug}`} style={{ textDecoration: "none" }}>
                        <Card hoverable size="small" style={{ borderRadius: 12, minWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Tag color={t.color} style={{ borderRadius: 8, margin: 0, fontWeight: 600 }}>#{t.name}</Tag>
                            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{t.post_count || 0} posts</span>
                          </div>
                          {t.description && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{t.description}</div>}
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {users.length > 0 && (!activeType || activeType === "user") && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <UserOutlined style={{ color: "#8b5cf6" }} /> Users ({users.length})
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
                    {users.map((u) => (
                      <Link key={u.id} href={`/user/${u.username || ""}`} style={{ textDecoration: "none" }}>
                        <Card hoverable size="small" style={{ borderRadius: 12 }}>
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

      {!query && <EmptyState icon="🔍" title="Search for anything" description="Find posts, questions, answers, discussions, tags, and users" />}
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
