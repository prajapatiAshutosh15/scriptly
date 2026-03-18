"use client";
import VoteButtons from "./VoteButtons";
import UserMiniCard from "@/components/shared/UserMiniCard";
import ArticleContent from "@/components/articles/ArticleContent";
import { formatRelativeTime } from "@/lib/utils";

export default function AnswerCard({ answer, questionAuthorId, currentUserId, onVote, onAccept }) {
  const canAccept = currentUserId === questionAuthorId && !answer.isAccepted;

  return (
    <div style={{ display: "flex", gap: 16, padding: "24px 0" }}>
      <VoteButtons
        votes={answer.votes}
        userVote={answer.userVote}
        isAccepted={answer.isAccepted}
        showAccept={true}
        canAccept={canAccept}
        onVote={(value) => onVote?.(answer.id, value)}
        onAccept={() => onAccept?.(answer.id)}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <ArticleContent content={answer.body} />
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: answer.isAccepted ? "rgba(34,197,94,0.05)" : "rgba(37,99,235,0.05)", padding: "8px 12px", borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>answered {formatRelativeTime(answer.createdAt)}</div>
            <UserMiniCard name={answer.author.name} username={answer.author.username} avatar={answer.author.avatar} reputation={answer.author.reputation} />
          </div>
        </div>
      </div>
    </div>
  );
}
