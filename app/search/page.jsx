"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input, Segmented, Typography, Card, Avatar, Tag, Skeleton } from "antd";
import {
  SearchOutlined, FileTextOutlined, QuestionCircleOutlined,
  MessageOutlined, TagOutlined, UserOutlined, CheckCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import EmptyState from "@/components/shared/EmptyState";
import AiAnswerCard from "@/components/search/AiAnswerCard";
import FollowUpChips from "@/components/search/FollowUpChips";
import { getDefaultAvatar } from "@/lib/utils";
import api from "@/services/api";

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

  // Traditional results
  const [results, setResults] = useState({});
  const [activeType, setActiveType] = useState("");

  // AI state
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiSources, setAiSources] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(true);

  // Phase 1: Instant PostgreSQL search
  useEffect(() => {
    if (query.length < 2) { setResults({}); return; }
    search(query, { type: activeType || undefined }).then((data) => setResults(data || {}));
  }, [query, activeType]);

  // Phase 2: Async RAG (only on query change, not type change)
  useEffect(() => {
    if (query.length < 2) {
      setAiAnswer(null); setAiSources([]); setFollowUps([]); setAiLoading(false);
      return;
    }

    let cancelled = false;
    setAiLoading(true);
    setShowAi(true);
    setAiAnswer(null);
    setAiSources([]);
    setFollowUps([]);

    api.post("/rag/ask", { question: query })
      .then((res) => {
        if (cancelled) return;
        const data = res.data || res;
        setAiAnswer(data.answer || null);
        setAiSources(data.sources || []);
        setFollowUps(data.follow_ups || []);
      })
      .catch(() => { /* silent — traditional results already showing */ })
      .finally(() => { if (!cancelled) setAiLoading(false); });

    return () => { cancelled = true; };
  }, [query]);

  const handleSearch = (value) => {
    if (value.trim()) {
      setActiveType("");
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleFollowUp = (question) => {
    setActiveType("");
    router.push(`/search?q=${encodeURIComponent(question)}`);
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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Search bar */}
      <div style={{ maxWidth: 640, margin: "0 auto 32px" }}>
        <Input.Search
          placeholder="Ask anything or search the community..."
          defaultValue={query}
          onSearch={handleSearch}
          size="large"
          enterButton
          style={{ borderRadius: 24 }}
          prefix={<SearchOutlined />}
        />
      </div>

      {query ? (
        <div className="search-layout" style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 28,
          alignItems: "start",
        }}>
          {/* ─── LEFT: AI Answer + Follow-ups ─── */}
          <div>
            {showAi && (aiLoading || aiAnswer) && (
              <AiAnswerCard
                answer={aiAnswer}
                sources={aiSources}
                loading={aiLoading}
                onClose={() => setShowAi(false)}
              />
            )}

            <FollowUpChips questions={followUps} onSelect={handleFollowUp} />

            {/* Show empty state hint if AI done + no answer + no results */}
            {!aiLoading && !aiAnswer && totalResults === 0 && (
              <EmptyState icon="🔍" title="No results found" description="Try different keywords or check for typos" />
            )}
          </div>

          {/* ─── RIGHT: Traditional results ─── */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 12,
                flexWrap: "wrap", gap: 8,
              }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {loading
                    ? "Searching..."
                    : <>{totalResults} result{totalResults !== 1 ? "s" : ""}</>
                  }
                </Text>
              </div>
              <Segmented
                options={types}
                value={activeType}
                onChange={setActiveType}
                size="small"
                style={{ fontSize: 12 }}
              />
            </div>

            {/* Results list */}
            <div style={{
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
              paddingRight: 4,
            }}>
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : totalResults === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
                  No matching content
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Posts */}
                  {posts.length > 0 && (!activeType || activeType === "post") && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <FileTextOutlined style={{ color: "#2563eb" }} /> Posts ({posts.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {posts.map((p) => (
                          <Link key={p.id} href={`/post/${p.slug}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              padding: "12px 14px", borderRadius: 10,
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-surface)",
                              transition: "all 0.15s", cursor: "pointer",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.3)"; e.currentTarget.style.background = "rgba(37,99,235,0.02)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
                            >
                              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4, lineHeight: 1.4 }}>{p.title}</div>
                              {p.snippet && <Snippet html={p.snippet} />}
                              <div style={{ marginTop: 6, display: "flex", gap: 10, fontSize: 11, color: "var(--text-secondary)" }}>
                                <span>@{p.author_username}</span>
                                <span>{p.likes_count || 0} likes</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  {questions.length > 0 && (!activeType || activeType === "question") && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <QuestionCircleOutlined style={{ color: "#22c55e" }} /> Questions ({questions.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {questions.map((q) => (
                          <Link key={q.id} href={`/questions/${q.slug}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              padding: "12px 14px", borderRadius: 10,
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-surface)",
                              transition: "all 0.15s",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
                            >
                              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>{q.title}</div>
                              <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--text-secondary)" }}>
                                <span>{q.votes_count || 0} votes</span>
                                <span>{q.answers_count || 0} answers</span>
                                {q.is_answered && <span style={{ color: "#22c55e" }}><CheckCircleFilled /> Answered</span>}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Answers */}
                  {answers.length > 0 && (!activeType || activeType === "answer") && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <MessageOutlined style={{ color: "#f59e0b" }} /> Answers ({answers.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {answers.map((a) => (
                          <Link key={a.id} href={`/questions/${a.question_slug}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              padding: "12px 14px", borderRadius: 10,
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-surface)",
                              transition: "all 0.15s",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
                            >
                              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
                                Re: <span style={{ fontWeight: 600 }}>{a.question_title}</span>
                              </div>
                              {a.snippet && <Snippet html={a.snippet} />}
                              <div style={{ marginTop: 6, display: "flex", gap: 10, fontSize: 11, color: "var(--text-secondary)" }}>
                                <span>@{a.author_username}</span>
                                <span>{a.votes_count || 0} votes</span>
                                {a.is_accepted && <span style={{ color: "#22c55e" }}><CheckCircleFilled /></span>}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discussions */}
                  {discussions.length > 0 && (!activeType || activeType === "discussion") && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <MessageOutlined style={{ color: "#8b5cf6" }} /> Discussions ({discussions.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {discussions.map((d) => (
                          <Link key={d.id} href={`/discussions/${d.slug || ""}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              padding: "12px 14px", borderRadius: 10,
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-surface)",
                              transition: "all 0.15s",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
                            >
                              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>{d.title}</div>
                              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                                {d.replies_count || 0} replies · @{d.author_username || ""}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (!activeType || activeType === "tag") && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <TagOutlined style={{ color: "#e5873a" }} /> Tags ({tags.length})
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {tags.map((t) => (
                          <Link key={t.id} href={`/tags/${t.slug}`} style={{ textDecoration: "none" }}>
                            <Tag color={t.color} style={{
                              borderRadius: 8, fontWeight: 600, fontSize: 12,
                              padding: "4px 10px", cursor: "pointer",
                            }}>
                              #{t.name} <span style={{ opacity: 0.6, fontWeight: 400 }}>({t.post_count || 0})</span>
                            </Tag>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Users */}
                  {users.length > 0 && (!activeType || activeType === "user") && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        <UserOutlined style={{ color: "#8b5cf6" }} /> Users ({users.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {users.map((u) => (
                          <Link key={u.id} href={`/user/${u.username || ""}`} style={{ textDecoration: "none" }}>
                            <div style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "10px 14px", borderRadius: 10,
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-surface)",
                              transition: "all 0.15s",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
                            >
                              <Avatar src={u.avatar || getDefaultAvatar(u.username)} size={32} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{u.name || "Unknown"}</div>
                                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>@{u.username} · {u.reputation || 0} rep</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="Search for anything"
          description="Ask a question or search posts, questions, answers, discussions, tags, and users"
        />
      )}

      {/* Responsive: stack on mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .search-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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
