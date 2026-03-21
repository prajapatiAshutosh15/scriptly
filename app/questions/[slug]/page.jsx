"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Space, Divider, Skeleton, message } from "antd";
import VoteButtons from "@/components/questions/VoteButtons";
import AnswerCard from "@/components/questions/AnswerCard";
import AnswerForm from "@/components/questions/AnswerForm";
import UserMiniCard from "@/components/shared/UserMiniCard";
import TagBadge from "@/components/shared/TagBadge";
import ArticleContent from "@/components/articles/ArticleContent";
import { useQuestions } from "@/hooks/useQuestions";
import { useAnswers } from "@/hooks/useAnswers";
import { useVotes } from "@/hooks/useVotes";
import { useAuthStore } from "@/stores/authStore";
import { normalizeQuestion, normalizeAnswer } from "@/lib/normalizers";
import { formatRelativeTime } from "@/lib/utils";
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
    if (USE_MOCK) {
      const mockQ = MOCK_QUESTION_DETAILS[slug] || Object.values(MOCK_QUESTION_DETAILS)[0];
      if (mockQ) {
        setQuestion(normalizeQuestion(mockQ));
        setAnswers((mockQ.answers || []).map(normalizeAnswer));
      }
      setLoading(false);
      return;
    }
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

  if (loading) return <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}><Skeleton active paragraph={{ rows: 12 }} /></div>;
  if (!question) return null;

  return (
    <div className="question-detail-wrapper" style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3, margin: 0, color: "var(--text-primary)" }}>{question.title}</h1>
      <div className="question-meta" style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
        <span>Asked {formatRelativeTime(question.createdAt)}</span>
        <span>Viewed {question.views || 0} times</span>
        <span>{question.answers || 0} answers</span>
      </div>
      <Divider style={{ margin: "16px 0" }} />
      <div className="question-vote-content" style={{ display: "flex", gap: 20 }}>
        <VoteButtons votes={question.votes} userVote={question.userVote} onVote={handleVote} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <ArticleContent content={question.body} />
          <Space size={4} wrap style={{ marginTop: 16 }}>
            {question.tags?.map((tag) => <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} />)}
          </Space>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(37,99,235,0.05)", padding: "8px 12px", borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>asked {formatRelativeTime(question.createdAt)}</div>
              <UserMiniCard name={question.author?.name} username={question.author?.username} avatar={question.author?.avatar} reputation={question.author?.reputation} />
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{answers.length} {answers.length === 1 ? "Answer" : "Answers"}</h2>
      {answers.map((a) => (
        <div key={a.id}>
          <AnswerCard answer={a} questionAuthorId={question.author?.id} currentUserId={user?.id} onVote={handleAnswerVote} onAccept={handleAccept} />
          <Divider style={{ margin: 0 }} />
        </div>
      ))}
      {isAuthenticated ? <AnswerForm onSubmit={handlePostAnswer} /> : (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-secondary)" }}>
          <a href="/signin" style={{ color: "#2563eb" }}>Sign in</a> to answer this question
        </div>
      )}
    </div>
  );
}
