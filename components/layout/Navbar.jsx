"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input, Space, Drawer, Avatar, Dropdown, message } from "antd";
import {
  SearchOutlined, MenuOutlined, UserOutlined, LogoutOutlined,
  BookOutlined, SettingOutlined, TrophyOutlined, EditOutlined,
  HomeOutlined, QuestionCircleOutlined, MessageOutlined,
  TagsOutlined, CompassOutlined, BellOutlined, RobotOutlined,
} from "@ant-design/icons";
import { SITE_NAME } from "@/lib/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/brand/Logo";
import NotificationBell from "./NotificationBell";
import { useAuthStore } from "@/stores/authStore";

const SIDEBAR_NAV = [
  { label: "My Feed", href: "/", icon: <HomeOutlined /> },
  { label: "Questions", href: "/questions", icon: <QuestionCircleOutlined /> },
  { label: "Discussions", href: "/discussions", icon: <MessageOutlined /> },
  { label: "Tags", href: "/tags", icon: <TagsOutlined /> },
  { label: "Explore", href: "/explore", icon: <CompassOutlined /> },
  { label: "AI Assistant", href: "/ai-assistant", icon: <RobotOutlined /> },
  { label: "Bookmarks", href: "/bookmarks", icon: <BookOutlined /> },
  { label: "Notifications", href: "/notifications", icon: <BellOutlined /> },
  { label: "Settings", href: "/settings", icon: <SettingOutlined /> },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Selective Zustand subscriptions
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleSearch = (value) => {
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const handleLogout = () => {
    logout();
    message.success("Signed out");
    router.push("/");
  };

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: <Link href={`/user/${user?.username}`}>My Profile</Link> },
    { key: "bookmarks", icon: <BookOutlined />, label: <Link href="/bookmarks">Bookmarks</Link> },
    { key: "drafts", icon: <EditOutlined />, label: <Link href="/write">My Drafts</Link> },
    { key: "leaderboard", icon: <TrophyOutlined />, label: <Link href="/leaderboard">Leaderboard</Link> },
    { key: "settings", icon: <SettingOutlined />, label: <Link href="/settings">Settings</Link> },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Sign Out", danger: true, onClick: handleLogout },
  ];

  return (
    <>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--nav-bg)",
      }}>
        {/* Tech glow line */}
        <div className="navbar-glow" />
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <Logo size={36} showText={true} textSize={20} />
          </Link>

          {/* Search - Centered, wide */}
          <div className="search-desktop" style={{ flex: "1 1 480px", maxWidth: 560 }}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: "var(--text-secondary)", fontSize: 13 }} />}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onPressEnter={() => handleSearch(searchVal)}
              style={{
                borderRadius: 20,
                fontSize: 13,
                border: "1px solid #2a2a2a",
                background: "#1a1a1a",
              }}
              allowClear
            />
          </div>

          {/* Actions */}
          <Space size={8} style={{ flexShrink: 0 }}>
            <ThemeToggle />
            <NotificationBell />

            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                <Avatar
                  src={user?.avatar}
                  style={{
                    cursor: "pointer",
                    background: "#e5873a",
                    border: "2px solid var(--border-color)",
                    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.15)",
                    transition: "all 0.2s ease",
                  }}
                  size={36}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </Dropdown>
            ) : (
              <Link href="/signin" className="hidden-mobile">
                <button style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  background: "#242424",
                  color: "#e8e8e8",
                  border: "1px solid #2a2a2a",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#e5873a"; e.currentTarget.style.color = "#e5873a"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#e8e8e8"; }}
                >
                  Sign In
                </button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="mobile-only"
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: 8, fontSize: 18 }}
            >
              <MenuOutlined />
            </button>
          </Space>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title={SITE_NAME}
        placement="right"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        size="default"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input
            placeholder="Search posts..."
            prefix={<SearchOutlined />}
            onPressEnter={(e) => { handleSearch(e.target.value); setMobileOpen(false); }}
            style={{ borderRadius: 20 }}
          />
          {SIDEBAR_NAV.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "#e5873a" : "var(--text-primary)",
                  background: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent",
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10, paddingTop: 20 }}>
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 20,
                  background: "transparent", border: "1px solid var(--border-color)",
                  color: "var(--text-primary)", fontWeight: 500, fontSize: 15, cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            ) : (
              <Link href="/signin" onClick={() => setMobileOpen(false)}>
                <button style={{
                  width: "100%", padding: "12px 0", borderRadius: 20,
                  background: "#242424", color: "#e8e8e8", border: "1px solid #2a2a2a",
                  fontWeight: 600, fontSize: 15, cursor: "pointer",
                }}>
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
