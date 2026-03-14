"use client";

export default function Logo({ size = 36, showText = true, textSize = 20 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Background rounded square */}
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="codeGrad" x1="12" y1="12" x2="36" y2="36">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="48" height="48" rx="14" fill="url(#logoGrad)" />

        {/* Left bracket < */}
        <path
          d="M18 16L10 24L18 32"
          stroke="url(#codeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right bracket > */}
        <path
          d="M30 16L38 24L30 32"
          stroke="url(#codeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Center slash / (represents script) */}
        <path
          d="M27 13L21 35"
          stroke="url(#codeGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span style={{
          fontWeight: 800,
          fontSize: textSize,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}>
          Script<span style={{
            background: "linear-gradient(135deg, #6366f1, #2563eb, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>ly</span>
        </span>
      )}
    </div>
  );
}
