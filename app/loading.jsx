export default function Loading() {
  const shimmer = { background: "#e5e7eb", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" };
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ ...shimmer, width: "100%", height: 300, borderRadius: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ ...shimmer, height: 280, borderRadius: 16 }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
