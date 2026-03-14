export default function UserLoading() {
  const shimmer = { background: "#e5e7eb", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" };
  return (
    <div>
      <div style={{ padding: "64px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...shimmer, width: 96, height: 96, borderRadius: "50%", marginBottom: 16 }} />
        <div style={{ ...shimmer, height: 28, width: 200, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 16, width: 300 }} />
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ ...shimmer, height: 280, borderRadius: 16 }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
