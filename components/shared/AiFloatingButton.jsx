"use client";
import Link from "next/link";
import { RobotOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";

export default function AiFloatingButton() {
  const pathname = usePathname();

  // Don't show on AI assistant page itself
  if (pathname === "/ai-assistant") return null;

  return (
    <Link href="/ai-assistant">
      <div style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #e5873a, #d4713a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(229,135,58,0.35)",
        zIndex: 50,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
        onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 25px rgba(229,135,58,0.5)"; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(229,135,58,0.35)"; }}
      >
        <RobotOutlined style={{ fontSize: 22, color: "#fff" }} />
      </div>
    </Link>
  );
}
