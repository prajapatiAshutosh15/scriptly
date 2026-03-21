"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, Badge } from "antd";
import {
  HomeOutlined, QuestionCircleOutlined, MessageOutlined,
  TagsOutlined, CompassOutlined, BookOutlined,
  BellOutlined, SettingOutlined, RobotOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";

const ICON_MAP = {
  HomeOutlined, QuestionCircleOutlined, MessageOutlined,
  TagsOutlined, CompassOutlined, BookOutlined,
  BellOutlined, SettingOutlined, RobotOutlined,
};

const GENERAL = [
  { label: "My Feed", href: "/", icon: "HomeOutlined" },
  { label: "Questions", href: "/questions", icon: "QuestionCircleOutlined" },
  { label: "Discussions", href: "/discussions", icon: "MessageOutlined" },
  { label: "Tags", href: "/tags", icon: "TagsOutlined" },
  { label: "Explore", href: "/explore", icon: "CompassOutlined" },
  { label: "AI Assistant", href: "/ai-assistant", icon: "RobotOutlined" },
];

const YOU = [
  { label: "Bookmarks", href: "/bookmarks", icon: "BookOutlined" },
  { label: "Settings", href: "/settings", icon: "SettingOutlined" },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavItem = ({ item }) => {
    const Icon = ICON_MAP[item.icon];
    const active = isActive(item.href);
    return (
      <Link href={item.href} style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", gap: 12, alignItems: "center",
          padding: "10px 16px", borderRadius: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14, fontWeight: 500, cursor: "pointer",
          color: active ? "#e5873a" : "#888888",
          background: active ? "rgba(229,135,58,0.1)" : "transparent",
          transition: "all 0.15s",
        }}>
          {Icon && <Icon style={{ fontSize: 18 }} />}
          <span>{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <aside style={{ borderRight: "1px solid #2a2a2a" }}>
      <div style={{ position: "sticky", top: 64, height: "calc(100vh - 64px)", overflowY: "auto", padding: "16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>
          <div style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: "0.08em", color: "#888888", padding: "16px 16px 8px", fontWeight: 600 }}>General</div>
          {GENERAL.map((item) => <NavItem key={item.href} item={item} />)}
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: "0.08em", color: "#888888", padding: "16px 16px 8px", fontWeight: 600 }}>You</div>
          {YOU.map((item) => <NavItem key={item.href} item={item} />)}
          {/* Notifications with badge */}
          <Link href="/bookmarks" style={{ textDecoration: "none" }}>
            <div className={`sidebar-nav-item ${pathname === "/notifications" ? "active" : ""}`}>
              <Badge count={unreadCount} size="small" offset={[2, -2]}>
                <BellOutlined style={{ fontSize: 18, color: pathname === "/notifications" ? "#e5873a" : "#888888" }} />
              </Badge>
              <span>Notifications</span>
            </div>
          </Link>
        </div>

        {/* User profile at bottom */}
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
          {isAuthenticated && user ? (
            <Link href={`/user/${user.username}`} style={{ textDecoration: "none" }}>
              <div className="sidebar-user">
                <Avatar src={user.avatar} size={36} style={{ background: "#e5873a", flexShrink: 0 }}>
                  {user.name?.[0]}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>@{user.username}</div>
                </div>
              </div>
            </Link>
          ) : (
            <div style={{ padding: "8px 16px" }}>
              <Link href="/signin">
                <button style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "#242424", color: "#e8e8e8", border: "1px solid #2a2a2a", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      </div>
    </aside>
  );
}
