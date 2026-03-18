"use client";
import { useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";

export default function VoteButtons({ votes = 0, userVote = null, isAccepted = false, onVote, onAccept, showAccept = false, canAccept = false }) {
  const [currentVote, setCurrentVote] = useState(userVote);
  const [count, setCount] = useState(votes);

  const handleVote = async (value) => {
    const prev = currentVote;
    const prevCount = count;

    if (currentVote === value) {
      setCurrentVote(null);
      setCount(value === "up" ? count - 1 : count + 1);
    } else {
      setCurrentVote(value);
      setCount(count + (value === "up" ? (prev === "down" ? 2 : 1) : (prev === "up" ? -2 : -1)));
    }

    try { await onVote?.(value); }
    catch { setCurrentVote(prev); setCount(prevCount); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 40 }}>
      <div onClick={() => handleVote("up")} style={{ cursor: "pointer", fontSize: 24, color: currentVote === "up" ? "#22c55e" : "var(--text-secondary)", transition: "color 0.2s", userSelect: "none", lineHeight: 1 }}>▲</div>
      <span style={{ fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>{count}</span>
      <div onClick={() => handleVote("down")} style={{ cursor: "pointer", fontSize: 24, color: currentVote === "down" ? "#ef4444" : "var(--text-secondary)", transition: "color 0.2s", userSelect: "none", lineHeight: 1 }}>▼</div>
      {showAccept && (
        <div onClick={canAccept ? onAccept : undefined}
          style={{ marginTop: 8, fontSize: 24, color: isAccepted ? "#22c55e" : "var(--text-secondary)", cursor: canAccept ? "pointer" : "default", transition: "color 0.2s" }}
          title={isAccepted ? "Accepted answer" : canAccept ? "Accept this answer" : ""}>
          <CheckCircleFilled />
        </div>
      )}
    </div>
  );
}
