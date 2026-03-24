"use client";
import Link from "next/link";
import { Avatar } from "antd";
import { getDefaultAvatar } from "@/lib/utils";

export default function UserMiniCard({ name, username, avatar, reputation, time }) {
  return (
    <Link href={`/user/${username || ""}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
      <Avatar src={avatar || getDefaultAvatar(username)} size={28} style={{ flexShrink: 0 }} />
      <div>
        <span style={{ color: "#2563eb", fontSize: 13, fontWeight: 500 }}>{name || username || "Unknown"}</span>
        {reputation != null && <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 6 }}>{(reputation || 0).toLocaleString()}</span>}
        {time && <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 6 }}>{time}</span>}
      </div>
    </Link>
  );
}
