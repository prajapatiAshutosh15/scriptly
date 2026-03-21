"use client";
import { Tag } from "antd";

const TIERS = [
  { min: 10000, label: "Legend", color: "#ef4444" },
  { min: 5000, label: "Expert", color: "#f59e0b" },
  { min: 1000, label: "Trusted", color: "#8b5cf6" },
  { min: 200, label: "Active", color: "#3b82f6" },
  { min: 50, label: "Contributor", color: "#22c55e" },
  { min: 0, label: "New", color: "#94a3b8" },
];

export default function ReputationBadge({ reputation = 0, showLabel = true }) {
  const tier = TIERS.find((t) => reputation >= t.min) || TIERS[TIERS.length - 1];

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontWeight: 600, color: tier.color, fontSize: 13 }}>{(reputation || 0).toLocaleString()}</span>
      {showLabel && <Tag style={{ borderRadius: 12, fontSize: 11, margin: 0 }} color={tier.color}>{tier.label}</Tag>}
    </span>
  );
}
