"use client";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

export default function FollowUpChips({ questions = [], onSelect }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [questions]);

  if (!questions.length) return null;

  return (
    <div style={{
      marginBottom: 24,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "all 0.5s ease",
    }}>
      <div style={{
        fontSize: 11, color: "var(--text-secondary)", marginBottom: 10,
        fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        People also ask
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 12,
              border: "1px solid var(--border-color)",
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              fontSize: 13, fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "left",
              width: "100%",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-10px)",
              transitionDelay: `${i * 100 + 200}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(229,135,58,0.4)";
              e.currentTarget.style.background = "rgba(229,135,58,0.04)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(229,135,58,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.background = "var(--bg-surface)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <SearchOutlined style={{ fontSize: 13, color: "#e5873a", flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{q}</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", opacity: 0.5, flexShrink: 0 }}>↵</span>
          </button>
        ))}
      </div>
    </div>
  );
}
