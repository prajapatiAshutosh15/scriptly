"use client";
import { ConfigProvider, App, theme as antdTheme } from "antd";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";

export default function AntdConfigProvider({ children }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const themeConfig = useMemo(() => ({
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    cssVar: true,
    token: {
      colorPrimary: "#2563eb",
      borderRadius: 8,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
      colorBgElevated: isDark ? "#1e293b" : "#ffffff",
      colorBgLayout: isDark ? "#0f172a" : "#f8fafc",
      colorText: isDark ? "#f1f5f9" : "#0f172a",
      colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
      colorBorder: isDark ? "#334155" : "#e2e8f0",
      colorBorderSecondary: isDark ? "#1e293b" : "#f1f5f9",
    },
    components: {
      Card: { paddingLG: 20 },
      Button: { borderRadius: 20 },
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
