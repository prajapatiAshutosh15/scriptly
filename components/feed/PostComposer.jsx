"use client";
import { useRouter } from "next/navigation";
import { Avatar } from "antd";
import { CodeOutlined, FileImageOutlined, QuestionCircleOutlined, SendOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import { getDefaultAvatar } from "@/lib/utils";

export default function PostComposer() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleAction = (path) => {
    router.push(isAuthenticated ? path : "/signin");
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      borderRadius: 12,
      border: "1px solid var(--border-color)",
      padding: 16,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Avatar src={user?.avatar || getDefaultAvatar(user?.username)} size={40} style={{ flexShrink: 0 }} />
        <div
          onClick={() => handleAction("/write")}
          style={{
            flex: 1,
            background: "var(--bg-primary)",
            borderRadius: 20,
            padding: "10px 16px",
            color: "var(--text-secondary)",
            fontSize: 14,
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "#e5873a"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
        >
          Share something with the community...
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 12, paddingLeft: 52 }}>
        <button onClick={() => handleAction("/write?type=code")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <CodeOutlined /> <span className="composer-btn-label">Code</span>
        </button>
        <button onClick={() => handleAction("/write")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <FileImageOutlined /> <span className="composer-btn-label">Blog</span>
        </button>
        <button onClick={() => handleAction("/questions/ask")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <QuestionCircleOutlined /> <span className="composer-btn-label">Question</span>
        </button>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => handleAction("/write")} style={{ width: 36, height: 36, borderRadius: "50%", background: "#242424", border: "1px solid #2a2a2a", color: "#e5873a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            <SendOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}
