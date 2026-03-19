"use client";
import { ConfigProvider, App, theme as antdTheme } from "antd";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";

export default function AntdConfigProvider({ children }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const themeConfig = useMemo(() => ({
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    cssVar: true,
    token: {
      colorPrimary: "#e5873a",
      borderRadius: 8,
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      colorBgContainer: isDark ? "#1a1a1a" : "#ffffff",
      colorBgElevated: isDark ? "#242424" : "#ffffff",
      colorBgLayout: isDark ? "#0f0f0f" : "#f5f5f5",
      colorText: isDark ? "#e8e8e8" : "#1a1a1a",
      colorTextSecondary: isDark ? "#888888" : "#666666",
      colorBorder: isDark ? "#2a2a2a" : "#e0e0e0",
      colorBorderSecondary: isDark ? "#1a1a1a" : "#f5f5f5",
    },
    components: {
      Card: { paddingLG: 20 },
      Button: {
        borderRadius: 8,
        primaryColor: isDark ? "#0f0f0f" : "#ffffff",
        colorPrimaryBg: "#e5873a",
        defaultBg: isDark ? "#1a1a1a" : "#f5f5f5",
        defaultColor: isDark ? "#e8e8e8" : "#1a1a1a",
        defaultBorderColor: isDark ? "#2a2a2a" : "#e0e0e0",
      },
      Tag: { borderRadiusSM: 12 },
    },
  }), [isDark]);

  return (
    <ConfigProvider theme={themeConfig}>
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
