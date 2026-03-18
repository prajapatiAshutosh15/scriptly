"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Input, Space, Drawer, Avatar, Dropdown, message } from "antd";
import { SearchOutlined, MenuOutlined, EditOutlined, UserOutlined, LogoutOutlined, BookOutlined, SettingOutlined, TrophyOutlined } from "@ant-design/icons";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/brand/Logo";
import NotificationBell from "./NotificationBell";
import { useAuthStore } from "@/stores/authStore";

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
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        background: "var(--nav-bg)",
      }}>
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
          <Link href="/" style={{ textDecoration: "none" }}>
            <Logo size={36} showText={true} textSize={20} />
          </Link>

          {/* Nav Links - Desktop */}
          <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: pathname === link.href ? "#2563eb" : "var(--text-secondary)",
                  background: pathname === link.href ? "rgba(37,99,235,0.1)" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search - Desktop */}
          <div className="search-desktop" style={{ flex: "0 1 280px" }}>
            <Input
              placeholder="Search posts..."
              prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onPressEnter={() => handleSearch(searchVal)}
              style={{ borderRadius: 20 }}
              allowClear
            />
          </div>

          {/* Actions */}
          <Space size={8}>
            <ThemeToggle />
            <NotificationBell />
            <Link href="/write" className="hidden-mobile">
              <Button type="primary" icon={<EditOutlined />} shape="round">Write</Button>
            </Link>

            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                <Avatar
                  src={user?.avatar}
                  style={{ cursor: "pointer", background: "#2563eb" }}
                  size={36}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </Dropdown>
            ) : (
              <Link href="/signin" className="hidden-mobile">
                <Button shape="round">Sign In</Button>
              </Link>
            )}

            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileOpen(true)}
              className="mobile-only"
            />
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
                color: pathname === link.href ? "#2563eb" : "var(--text-primary)",
                background: pathname === link.href ? "rgba(37,99,235,0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10, paddingTop: 20 }}>
            <Link href="/write" onClick={() => setMobileOpen(false)}>
              <Button type="primary" block shape="round" size="large" icon={<EditOutlined />}>
                Write a Post
              </Button>
            </Link>
            {isAuthenticated ? (
              <Button block shape="round" size="large" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                Sign Out
              </Button>
            ) : (
              <Link href="/signin" onClick={() => setMobileOpen(false)}>
                <Button block shape="round" size="large">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
