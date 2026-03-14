export default function PostLoading() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ width: "100%", height: 300, borderRadius: 16, background: "#e5e7eb", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ marginTop: 24 }}>
        <div style={{ height: 32, width: "80%", background: "#e5e7eb", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 20, width: "50%", background: "#e5e7eb", borderRadius: 8, marginTop: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e5e7eb", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div>
          <div style={{ height: 14, width: 120, background: "#e5e7eb", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 12, width: 180, background: "#e5e7eb", borderRadius: 6, marginTop: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ height: 16, width: `${90 - i * 5}%`, background: "#e5e7eb", borderRadius: 6, marginTop: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
