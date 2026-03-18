"use client";
import { Typography } from "antd";

export default function EmptyState({ icon = "📭", title = "Nothing here yet", description = "" }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <Typography.Title level={4} style={{ margin: 0, color: "var(--text-primary)" }}>{title}</Typography.Title>
      {description && <Typography.Text style={{ color: "var(--text-secondary)", marginTop: 8, display: "block" }}>{description}</Typography.Text>}
    </div>
  );
}
