"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Space, Divider, Skeleton, message, Avatar, Button, Tag } from "antd";
import { EyeOutlined, ClockCircleOutlined, MessageOutlined, ShareAltOutlined } from "@ant-design/icons";
import Link from "next/link";
import VoteButtons from "@/components/questions/VoteButtons";
import AnswerCard from "@/components/questions/AnswerCard";
import AnswerForm from "@/components/questions/AnswerForm";
import TagBadge from "@/components/shared/TagBadge";
import ArticleContent from "@/components/articles/ArticleContent";
import { useQuestions } from "@/hooks/useQuestions";
import { useAnswers } from "@/hooks/useAnswers";
import { useVotes } from "@/hooks/useVotes";
import { useAuthStore } from "@/stores/authStore";
import { normalizeQuestion, normalizeAnswer } from "@/lib/normalizers";
import { formatRelativeTime, getDefaultAvatar } from "@/lib/utils";
import { USE_MOCK, MOCK_QUESTION_DETAILS } from "@/lib/mockData";

export default function QuestionDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { fetchBySlug } = useQuestions();
  const { createAnswer, acceptAnswer } = useAnswers();
  const { vote } = useVotes();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadQuestion(); }, [slug]);

  const loadQuestion = async () => {
    setLoading(true);
    try {
      const data = await fetchBySlug(slug);
      const q = data.question;
      setQuestion(normalizeQuestion(q));
      setAnswers((q.answers || []).map(normalizeAnswer));
    } catch { message.error("Failed to load question"); }
    finally { setLoading(false); }
  };

  const handleVote = async (value) => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    await vote("question", question.id, value);
  };

  const handleAnswerVote = async (answerId, value) => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    await vote("answer", answerId, value);
  };

  const handleAccept = async (answerId) => {
    try { await acceptAnswer(answerId); message.success("Answer accepted!"); loadQuestion(); }
    catch (err) { message.error(err?.error?.message || "Failed to accept"); }
  };

  const handlePostAnswer = async (data) => { await createAnswer(question.id, data); loadQuestion(); };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      message.success("Link copied!");
    }
  };

  if (loading) return <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}><Skeleton active paragraph={{ rows: 12 }} /></div>;
  if (!question) return null;

  const sortedAnswers = [...answers].sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0) || b.votes - a.votes);

  return (
    <div className="question-detail-wrapper" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, margin: 0, color: "var(--text-primary)" }}>
          {question.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          <Space size={16} style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            <span><ClockCircleOutlined /> Asked {formatRelativeTime(question.createdAt)}</span>
            <span><EyeOutlined /> {question.views || 0} views</span>
            <span><MessageOutlined /> {question.answers || 0} answers</span>
          </Space>
          <Button type="text" icon={<ShareAltOutlined />} size="small" onClick={handleShare} style={{ color: "var(--text-secondary)" }}>Share</Button>
        </div>
      </div>

      <Divider style={{ margin: "0 0 24px" }} />

      {/* Question Body */}
      <div style={{ display: "flex", gap: 20 }}>
        <VoteButtons votes={question.votes} userVote={question.userVote} onVote={handleVote} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, lineHeight: 1.8 }}>
            <ArticleContent content={question.body} />
          </div>

          {/* Tags */}
          <Space size={6} wrap style={{ marginTop: 20 }}>
            {question.tags?.map((tag) => <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} />)}
          </Space>

          {/* Author Card */}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              background: "var(--bg-surface, rgba(37,99,235,0.04))",
              padding: "12px 16px", borderRadius: 12,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Link href={`/user/${question.author?.username || ""}`}>
                <Avatar src={question.author?.avatar || getDefaultAvatar(question.author?.username)} size={36} />
              </Link>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 2 }}>asked {formatRelativeTime(question.createdAt)}</div>
                <Link href={`/user/${question.author?.username || ""}`} style={{ textDecoration: "none", color: "#2563eb", fontWeight: 600, fontSize: 14 }}>
                  {question.author?.name || question.author?.username || "Unknown"}
                </Link>
                {question.author?.reputation != null && (
                  <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 6 }}>{question.author.reputation}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <Divider style={{ margin: "32px 0 24px" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
          {sortedAnswers.length} {sortedAnswers.length === 1 ? "Answer" : "Answers"}
        </h2>
      </div>

      {sortedAnswers.map((a) => (
        <div key={a.id}>
          <AnswerCard answer={a} questionAuthorId={question.author?.id} currentUserId={user?.id} onVote={handleAnswerVote} onAccept={handleAccept} />
          <Divider style={{ margin: 0 }} />
        </div>
      ))}

      {/* Answer Form */}
      {isAuthenticated ? <AnswerForm onSubmit={handlePostAnswer} /> : (
        <div style={{
          textAlign: "center", padding: "40px 0", marginTop: 24,
          background: "var(--bg-surface, rgba(37,99,235,0.04))", borderRadius: 16,
        }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, margin: 0 }}>
            <a href="/signin" style={{ color: "#2563eb", fontWeight: 600 }}>Sign in</a> to answer this question
          </p>
        </div>
      )}
    </div>
  );
}
