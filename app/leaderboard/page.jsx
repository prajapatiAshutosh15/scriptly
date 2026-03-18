"use client";
import { useState, useEffect } from "react";
import { Table, Avatar, Skeleton } from "antd";
import Link from "next/link";
import ReputationBadge from "@/components/shared/ReputationBadge";
import api from "@/services/api";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users", { params: { page: 1, limit: 50, sort: "reputation" } })
      .then((res) => setUsers(res.data?.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "#", key: "rank", width: 60, render: (_, __, i) => <span style={{ fontWeight: 700, color: i < 3 ? "#f59e0b" : "var(--text-secondary)" }}>{i + 1}</span> },
    { title: "User", key: "user", render: (_, u) => (
      <Link href={`/user/${u.username}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Avatar src={u.avatar} size={32} style={{ background: "#2563eb" }}>{u.name?.[0]}</Avatar>
        <div>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{u.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>@{u.username}</div>
        </div>
      </Link>
    )},
    { title: "Reputation", key: "rep", width: 180, render: (_, u) => <ReputationBadge reputation={u.reputation} /> },
    { title: "Answers", key: "ans", width: 100, render: (_, u) => u.answers_count || 0 },
    { title: "Questions", key: "qs", width: 100, render: (_, u) => u.questions_count || 0 },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "var(--text-primary)" }}>Leaderboard</h1>
      {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : (
        <Table dataSource={users} columns={columns} rowKey="id" pagination={false} style={{ borderRadius: 16, overflow: "hidden" }} />
      )}
    </div>
  );
}
