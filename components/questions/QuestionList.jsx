"use client";
import { Skeleton } from "antd";
import QuestionCard from "./QuestionCard";
import EmptyState from "@/components/shared/EmptyState";
import { normalizeQuestion } from "@/lib/normalizers";

export default function QuestionList({ questions = [], loading = false }) {
  if (loading) {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!questions.length) return <EmptyState icon="❓" title="No questions yet" description="Be the first to ask!" />;

  return (
    <div>
      {questions.map((q) => <QuestionCard key={q.id || q.slug} question={normalizeQuestion(q)} />)}
    </div>
  );
}
