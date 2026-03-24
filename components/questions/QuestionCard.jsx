"use client";
import Link from "next/link";
import { Tag, Avatar, Space } from "antd";
import { formatRelativeTime, getDefaultAvatar } from "@/lib/utils";

export default function QuestionCard({ question }) {
  const { slug, title, tags, votes, answers, views, isAnswered, author, createdAt } = question;

  return (
    <div style={{ display: "flex", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border-color)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 60, textAlign: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{votes}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>votes</div>
        </div>
        <div style={{
          padding: "2px 10px", borderRadius: 6, fontSize: 13, fontWeight: 600,
          background: isAnswered ? "#22c55e" : "transparent",
          color: isAnswered ? "#fff" : answers > 0 ? "#22c55e" : "var(--text-secondary)",
          border: isAnswered ? "none" : answers > 0 ? "1px solid #22c55e" : "1px solid var(--border-color)",
        }}>
          {answers} <span style={{ fontSize: 11, fontWeight: 400 }}>ans</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{views} views</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/questions/${slug}`} style={{ textDecoration: "none" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#2563eb", lineHeight: 1.4 }}>{title}</h3>
        </Link>
        <Space size={4} wrap style={{ marginTop: 8 }}>
          {tags?.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Tag style={{ borderRadius: 12, margin: 0, fontSize: 12 }} color={tag.color}>{tag.name}</Tag>
            </Link>
          ))}
        </Space>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <Link href={`/user/${author?.username || ""}`} style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            <Avatar src={author?.avatar || getDefaultAvatar(author?.username)} size={20} />
            <span style={{ fontSize: 12, color: "#2563eb" }}>{author?.name || "Unknown"}</span>
            {author?.reputation && <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{author.reputation}</span>}
          </Link>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>asked {formatRelativeTime(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
