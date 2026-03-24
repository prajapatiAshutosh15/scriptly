"use client";
import Link from "next/link";
import { Avatar, Tag } from "antd";
import VoteButtons from "./VoteButtons";
import ArticleContent from "@/components/articles/ArticleContent";
import { formatRelativeTime, getDefaultAvatar } from "@/lib/utils";

export default function AnswerCard({ answer, questionAuthorId, currentUserId, onVote, onAccept }) {
  const canAccept = currentUserId === questionAuthorId && !answer.isAccepted;

  return (
    <div style={{
      display: "flex", gap: 16, padding: "24px 0",
      borderLeft: answer.isAccepted ? "3px solid #22c55e" : "none",
      paddingLeft: answer.isAccepted ? 20 : 0,
    }}>
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
        {answer.isAccepted && (
          <Tag color="success" style={{ borderRadius: 12, marginBottom: 12, fontWeight: 600 }}>Accepted Answer</Tag>
        )}
        <div style={{ fontSize: 15, lineHeight: 1.8 }}>
          <ArticleContent content={answer.body} />
        </div>
        <div style={{
          marginTop: 20, display: "flex", justifyContent: "flex-end",
        }}>
          <div style={{
            background: answer.isAccepted ? "rgba(34,197,94,0.06)" : "var(--bg-surface, rgba(37,99,235,0.04))",
            padding: "10px 14px", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Link href={`/user/${answer.author?.username || ""}`}>
              <Avatar src={answer.author?.avatar || getDefaultAvatar(answer.author?.username)} size={32} />
            </Link>
            <div>
              <Link href={`/user/${answer.author?.username || ""}`} style={{ textDecoration: "none", color: "#2563eb", fontWeight: 600, fontSize: 13 }}>
                {answer.author?.name || answer.author?.username || "Unknown"}
              </Link>
              {answer.author?.reputation != null && (
                <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 6 }}>{answer.author.reputation}</span>
              )}
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>answered {formatRelativeTime(answer.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
