"use client";
import { useState } from "react";

export default function VoteWidget({ votes = 0, userVote = null, onVote, size = "default" }) {
  const [currentVote, setCurrentVote] = useState(userVote);
  const [count, setCount] = useState(votes);

  const handleVote = async (value) => {
    const oldVote = currentVote;
    const oldCount = count;

    if (currentVote === value) {
      setCurrentVote(null);
      setCount(value === "up" ? count - 1 : count + 1);
    } else {
      setCurrentVote(value);
      const delta = value === "up" ? (oldVote === "down" ? 2 : 1) : (oldVote === "up" ? -2 : -1);
      setCount(count + delta);
    }

    try {
      await onVote?.(value);
    } catch {
      setCurrentVote(oldVote);
      setCount(oldCount);
    }
  };

  const fs = size === "small" ? 16 : 22;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div onClick={() => handleVote("up")} style={{ cursor: "pointer", color: currentVote === "up" ? "#22c55e" : "var(--text-secondary)", fontSize: fs, transition: "color 0.2s", userSelect: "none" }}>▲</div>
      <span style={{ fontWeight: 700, fontSize: size === "small" ? 14 : 18, color: "var(--text-primary)" }}>{count}</span>
      <div onClick={() => handleVote("down")} style={{ cursor: "pointer", color: currentVote === "down" ? "#ef4444" : "var(--text-secondary)", fontSize: fs, transition: "color 0.2s", userSelect: "none" }}>▼</div>
    </div>
  );
}
