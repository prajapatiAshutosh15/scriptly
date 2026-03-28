"use client";
import { useState, useEffect, useRef } from "react";
import { Tag } from "antd";
import {
  RobotOutlined, FileTextOutlined, QuestionCircleOutlined,
  MessageOutlined, CloseOutlined, LinkOutlined,
  DownOutlined, UpOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import ArticleContent from "@/components/articles/ArticleContent";

const SOURCE_ICONS = {
  post: <FileTextOutlined style={{ fontSize: 11 }} />,
  question: <QuestionCircleOutlined style={{ fontSize: 11 }} />,
  answer: <MessageOutlined style={{ fontSize: 11 }} />,
  discussion: <MessageOutlined style={{ fontSize: 11 }} />,
};

const SOURCE_COLORS = {
  post: { bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.2)", text: "#3b82f6" },
  question: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#22c55e" },
  answer: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "#f59e0b" },
  discussion: { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)", text: "#8b5cf6" },
};

function getSourceUrl(source) {
  switch (source.type) {
    case "post": return `/post/${source.slug}`;
    case "question": return `/questions/${source.slug}`;
    case "answer": return source.slug ? `/questions/${source.slug}` : "#";
    case "discussion": return `/discussions/${source.slug}`;
    default: return "#";
  }
}

/* ── Typewriter hook ────────────────────────────────── */
function useTypewriter(text, speed = 8) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (!text) { setDisplayed(""); setDone(false); idx.current = 0; return; }
    setDisplayed("");
    setDone(false);
    idx.current = 0;

    const chunkSize = 4;
    const interval = setInterval(() => {
      idx.current += chunkSize;
      if (idx.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, idx.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

/* ── Thinking animation ─────────────────────────────── */
function ThinkingState() {
  const [msgIdx, setMsgIdx] = useState(0);
  const messages = [
    "Searching community knowledge...",
    "Analyzing posts and discussions...",
    "Synthesizing answer...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "24px 0" }}>
      <div className="ai-thinking-icon">
        <RobotOutlined style={{ fontSize: 16, color: "#fff" }} />
      </div>
      <div>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: "var(--text-primary)", marginBottom: 6,
          transition: "opacity 0.3s",
        }}>
          {messages[msgIdx]}
        </div>
        <div className="ai-thinking-dots">
          <span /><span /><span />
        </div>
      </div>

      <style jsx>{`
        .ai-thinking-icon {
          width: 36px; height: 36px; border-radius: 12px;
          background: linear-gradient(135deg, #e5873a, #f5a623);
          display: flex; align-items: center; justify-content: center;
          animation: pulse-glow 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(229,135,58,0.3); }
          50% { box-shadow: 0 0 24px rgba(229,135,58,0.6); }
        }
        .ai-thinking-dots {
          display: flex; gap: 5px;
        }
        .ai-thinking-dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: #e5873a; opacity: 0.3;
          animation: dot-bounce 1.4s ease-in-out infinite;
        }
        .ai-thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
        .ai-thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
          40% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

/* ── Source pill ─────────────────────────────────────── */
function SourcePill({ source }) {
  const colors = SOURCE_COLORS[source.type] || SOURCE_COLORS.post;
  return (
    <Link href={getSourceUrl(source)} style={{ textDecoration: "none" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 12px", borderRadius: 20,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: 12, color: colors.text,
        transition: "all 0.2s",
        cursor: "pointer",
        maxWidth: 280,
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 2px 8px ${colors.border}`; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {SOURCE_ICONS[source.type]}
        <span style={{
          overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap", fontWeight: 500,
        }}>
          {source.title || "Untitled"}
        </span>
      </div>
    </Link>
  );
}

/* ── Collapsible answer content ─────────────────────── */
const COLLAPSE_THRESHOLD = 600; // characters

function CollapsibleAnswer({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text && text.length > COLLAPSE_THRESHOLD;

  const displayText = isLong && !expanded
    ? text.slice(0, COLLAPSE_THRESHOLD) + "..."
    : text;

  return (
    <div>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-primary)" }}>
        <ArticleContent content={displayText} />
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 12, padding: "8px 16px", borderRadius: 10,
            border: "1px solid var(--border-color)",
            background: "var(--bg-surface)",
            color: "#e5873a", fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(229,135,58,0.4)";
            e.currentTarget.style.background = "rgba(229,135,58,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-color)";
            e.currentTarget.style.background = "var(--bg-surface)";
          }}
        >
          {expanded ? <>Show less <UpOutlined style={{ fontSize: 10 }} /></> : <>Show more <DownOutlined style={{ fontSize: 10 }} /></>}
        </button>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */
export default function AiAnswerCard({ answer, sources = [], loading, onClose }) {
  const { displayed, done } = useTypewriter(loading ? "" : answer, 8);
  const [sourcesVisible, setSourcesVisible] = useState(false);

  useEffect(() => {
    if (done && answer) {
      const t = setTimeout(() => setSourcesVisible(true), 200);
      return () => clearTimeout(t);
    }
    setSourcesVisible(false);
  }, [done, answer]);

  if (!loading && !answer) return null;

  const filteredSources = sources.filter((s) => (s.similarity || 1) > 0.1).slice(0, 6);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        position: "relative",
        borderRadius: 16,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(229,135,58,0.25)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(229,135,58,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Animated gradient top bar */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #e5873a, #f5a623, #e5873a)",
          backgroundSize: "200% 100%",
          animation: loading ? "gradient-shift 2s ease infinite" : "none",
        }} />

        <div style={{ padding: "20px 24px" }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "linear-gradient(135deg, #e5873a, #f5a623)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px rgba(229,135,58,0.3)",
              }}>
                <RobotOutlined style={{ fontSize: 16, color: "#fff" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
                AI Answer
              </span>
              <Tag style={{
                borderRadius: 10, fontSize: 10, margin: 0,
                background: "rgba(229,135,58,0.1)",
                border: "1px solid rgba(229,135,58,0.2)",
                color: "#e5873a", fontWeight: 600,
              }}>
                BETA
              </Tag>
            </div>
            {onClose && !loading && (
              <CloseOutlined
                onClick={onClose}
                style={{
                  fontSize: 13, color: "var(--text-secondary)",
                  cursor: "pointer", padding: 6, borderRadius: 6,
                }}
              />
            )}
          </div>

          {/* Content */}
          {loading ? (
            <ThinkingState />
          ) : done ? (
            <CollapsibleAnswer text={answer} />
          ) : (
            /* Typewriter phase — show raw text as it types */
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-primary)" }}>
              <ArticleContent content={displayed} />
            </div>
          )}

          {/* Sources — fade in after typing completes */}
          {filteredSources.length > 0 && !loading && (
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: "1px solid var(--border-color)",
              opacity: sourcesVisible ? 1 : 0,
              transform: sourcesVisible ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.4s ease",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 11, color: "var(--text-secondary)",
                fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.05em", marginBottom: 10,
              }}>
                <LinkOutlined style={{ fontSize: 11 }} />
                Sources
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filteredSources.map((s, i) => (
                  <SourcePill key={`${s.type}-${s.id}-${i}`} source={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
