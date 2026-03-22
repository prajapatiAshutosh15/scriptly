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
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#e5873a" />
            <stop offset="100%" stopColor="#d4713a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#logoGrad)" />

        {/* Left bracket < */}
        <path
          d="M18 16L10 24L18 32"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right bracket > */}
        <path
          d="M30 16L38 24L30 32"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Center slash / */}
        <path
          d="M27 13L21 35"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: textSize,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}>
          script<span style={{ color: "#e5873a" }}>ly</span>
        </span>
      )}
    </div>
  );
}
