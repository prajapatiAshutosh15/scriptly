export default function PricingLoading() {
  const shimmer = { background: "#e5e7eb", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" };
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ ...shimmer, height: 40, width: 350, margin: "0 auto 12px" }} />
      <div style={{ ...shimmer, height: 20, width: 280, margin: "0 auto 48px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ ...shimmer, height: 500, borderRadius: 20 }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
