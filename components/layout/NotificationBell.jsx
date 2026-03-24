"use client";
import { useState, useEffect, useRef } from "react";
import { Badge, Dropdown, Typography, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useNotifications } from "@/hooks/useNotifications";
import { getRelativeTime } from "@/lib/utils";

function requestDesktopPermission() {
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function showDesktopNotification(title, body) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico", tag: "tle-ai-notif" });
  }
}

export default function NotificationBell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const prevCount = useRef(unreadCount);
  const { fetchUnreadCount, fetchNotifications, markAllAsRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      requestDesktopPermission();
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Show desktop notification when new unread arrives
  useEffect(() => {
    if (unreadCount > prevCount.current && prevCount.current !== undefined) {
      showDesktopNotification("TLE.ai", `You have ${unreadCount} new notification${unreadCount > 1 ? "s" : ""}`);
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  const handleOpen = async (visible) => {
    setOpen(visible);
    if (visible) {
      const data = await fetchNotifications({ limit: 10 });
      setNotifications(data?.notifications || []);
    }
  };

  if (!isAuthenticated) return null;

  const items = notifications.length === 0
    ? [{ key: "empty", label: <Typography.Text type="secondary">No notifications</Typography.Text> }]
    : notifications.map((n) => ({
        key: n.id,
        label: (
          <div style={{ maxWidth: 280, padding: "4px 0" }}>
            <Typography.Text strong style={{ fontSize: 13 }}>{n.actor_name || n.actor_username || "Someone"}</Typography.Text>
            <Typography.Text style={{ fontSize: 13, marginLeft: 4 }}>{(n.type || "").replace(/_/g, " ")}</Typography.Text>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{getRelativeTime(n.created_at)}</div>
          </div>
        ),
      }));

  if (unreadCount > 0) {
    items.push({ type: "divider" });
    items.push({ key: "mark-all", label: <Button type="link" size="small" onClick={markAllAsRead}>Mark all as read</Button> });
  }

  return (
    <Dropdown menu={{ items }} trigger={["click"]} onOpenChange={handleOpen} open={open} placement="bottomRight">
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 20, cursor: "pointer", color: "var(--text-secondary)" }} />
      </Badge>
    </Dropdown>
  );
}
