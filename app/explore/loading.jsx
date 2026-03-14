export default function ExploreLoading() {
  const shimmer = { background: "#e5e7eb", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" };
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ ...shimmer, height: 36, width: 160, marginBottom: 8 }} />
      <div style={{ ...shimmer, height: 20, width: 300, marginBottom: 24 }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ ...shimmer, height: 32, width: 80, borderRadius: 16 }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ ...shimmer, height: 280, borderRadius: 16 }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
