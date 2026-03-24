"use client";
import { useState, useEffect } from "react";
import { Table, Avatar, Skeleton } from "antd";
import Link from "next/link";
import ReputationBadge from "@/components/shared/ReputationBadge";
import api from "@/services/api";
import { MOCK_USERS, USE_MOCK } from "@/lib/mockData";
import { getDefaultAvatar } from "@/lib/utils";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCK) { setUsers(MOCK_USERS); setLoading(false); return; }
    api.get("/users", { params: { page: 1, limit: 50, sort: "reputation" } })
      .then((res) => {
        const list = res.data?.users || [];
        setUsers(list.length > 0 ? list : MOCK_USERS);
      })
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "#", key: "rank", width: 60, render: (_, __, i) => (
      <span style={{ fontWeight: 700, fontSize: 16, color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "var(--text-secondary)" }}>
        {i + 1}
      </span>
    )},
    { title: "User", key: "user", render: (_, u) => (
      <Link href={`/user/${u.username || ""}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
        <Avatar src={u.avatar || getDefaultAvatar(u.username)} size={36} />
        <div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{u.name || "Unknown"}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>@{u.username || ""}</div>
        </div>
      </Link>
    )},
    { title: "Reputation", key: "rep", width: 180, render: (_, u) => <ReputationBadge reputation={u.reputation} /> },
    { title: "Answers", key: "ans", width: 100, render: (_, u) => <span style={{ color: "var(--text-secondary)" }}>{u.answers_count || 0}</span> },
    { title: "Questions", key: "qs", width: 100, render: (_, u) => <span style={{ color: "var(--text-secondary)" }}>{u.questions_count || 0}</span> },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Leaderboard</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Top contributors in the community</p>
      {loading ? (
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border-color)", padding: 24 }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>
              <Skeleton.Avatar active size={36} />
              <Skeleton active title={{ width: 150 }} paragraph={{ rows: 0 }} style={{ flex: 1 }} />
              <Skeleton active title={{ width: 80 }} paragraph={{ rows: 0 }} />
            </div>
          ))}
        </div>
      ) : (
        <Table dataSource={users} columns={columns} rowKey="id" pagination={false}
          style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-color)" }} />
      )}
    </div>
  );
}
