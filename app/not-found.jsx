import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 120, fontWeight: 900, opacity: 0.08, lineHeight: 1 }}>404</div>
      <h2 style={{ marginTop: -20, fontSize: 24, fontWeight: 700 }}>Page Not Found</h2>
      <p style={{ color: "#64748b", marginBottom: 32, maxWidth: 400 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: "12px 32px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: 24,
          fontWeight: 600,
          textDecoration: "none",
          fontSize: 15,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
