"use client";
import { useState } from "react";
import { CaretUpFilled, CaretDownFilled, CheckCircleFilled } from "@ant-design/icons";

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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 48 }}>
      <button
        onClick={() => handleVote("up")}
        style={{
          width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border-color)",
          background: currentVote === "up" ? "rgba(34,197,94,0.1)" : "transparent",
          color: currentVote === "up" ? "#22c55e" : "var(--text-secondary)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, transition: "all 0.2s",
        }}
      >
        <CaretUpFilled />
      </button>
      <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)", padding: "4px 0" }}>{count}</span>
      <button
        onClick={() => handleVote("down")}
        style={{
          width: 40, height: 40, borderRadius: 8, border: "1px solid var(--border-color)",
          background: currentVote === "down" ? "rgba(239,68,68,0.1)" : "transparent",
          color: currentVote === "down" ? "#ef4444" : "var(--text-secondary)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, transition: "all 0.2s",
        }}
      >
        <CaretDownFilled />
      </button>
      {showAccept && (
        <button
          onClick={canAccept ? onAccept : undefined}
          style={{
            marginTop: 8, width: 40, height: 40, borderRadius: 8, border: "none",
            background: isAccepted ? "rgba(34,197,94,0.1)" : "transparent",
            color: isAccepted ? "#22c55e" : "var(--text-secondary)",
            cursor: canAccept ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, transition: "all 0.2s",
          }}
          title={isAccepted ? "Accepted answer" : canAccept ? "Accept this answer" : ""}
        >
          <CheckCircleFilled />
        </button>
      )}
    </div>
  );
}
