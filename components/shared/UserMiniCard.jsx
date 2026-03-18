"use client";
import Link from "next/link";
import { Avatar } from "antd";

export default function UserMiniCard({ name, username, avatar, reputation, time }) {
  return (
    <Link href={`/user/${username}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
      <Avatar src={avatar} size={28} style={{ background: "#2563eb", flexShrink: 0 }}>{name?.[0]?.toUpperCase()}</Avatar>
      <div>
        <span style={{ color: "#2563eb", fontSize: 13, fontWeight: 500 }}>{name || username}</span>
        {reputation !== undefined && <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 6 }}>{reputation.toLocaleString()}</span>}
        {time && <span style={{ color: "var(--text-secondary)", fontSize: 12, marginLeft: 6 }}>{time}</span>}
      </div>
    </Link>
  );
}
