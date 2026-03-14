export default function PageLoading() {
  const shimmer = { background: "#e5e7eb", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" };
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ ...shimmer, height: 40, width: 280, marginBottom: 12 }} />
      <div style={{ ...shimmer, height: 20, width: 400, marginBottom: 40 }} />
      <div style={{ ...shimmer, height: 200, borderRadius: 16, marginBottom: 24 }} />
      <div style={{ ...shimmer, height: 16, width: "90%", marginBottom: 8 }} />
      <div style={{ ...shimmer, height: 16, width: "75%", marginBottom: 8 }} />
      <div style={{ ...shimmer, height: 16, width: "85%" }} />
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
