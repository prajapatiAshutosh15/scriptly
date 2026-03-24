"use client";
import Link from "next/link";
import { Avatar, Tag } from "antd";
import { MessageOutlined, EyeOutlined, PushpinFilled, LockFilled } from "@ant-design/icons";
import { formatRelativeTime, getDefaultAvatar } from "@/lib/utils";

export default function DiscussionCard({ discussion }) {
  const { slug, title, replies, views, isPinned, isLocked, categoryName, categoryColor, author, lastActivityAt } = discussion;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: "1px solid var(--border-color)" }}>
      <Avatar src={author?.avatar || getDefaultAvatar(author?.username)} size={36} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isPinned && <PushpinFilled style={{ color: "#f59e0b", fontSize: 12 }} />}
          {isLocked && <LockFilled style={{ color: "var(--text-secondary)", fontSize: 12 }} />}
          <Link href={`/discussions/${slug}`} style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 12, color: "var(--text-secondary)" }}>
          <Tag style={{ borderRadius: 12, margin: 0, fontSize: 11 }} color={categoryColor}>{categoryName}</Tag>
          <span>{author?.name || "Unknown"}</span>
          <span>·</span>
          <span>{formatRelativeTime(lastActivityAt)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-secondary)", flexShrink: 0 }}>
        <span><MessageOutlined /> {replies}</span>
        <span><EyeOutlined /> {views}</span>
      </div>
    </div>
  );
}
