"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-color)",
      background: "var(--card-bg)",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 12,
      color: "var(--text-secondary)",
    }}>
      <span>&copy; 2026 Scriptly</span>
      <div style={{ display: "flex", gap: 16 }}>
        <Link href="/privacy" style={{ textDecoration: "none", color: "var(--text-secondary)", transition: "color 0.2s" }}>Privacy</Link>
        <span>&middot;</span>
        <Link href="/terms" style={{ textDecoration: "none", color: "var(--text-secondary)", transition: "color 0.2s" }}>Terms</Link>
      </div>
    </footer>
  );
}
