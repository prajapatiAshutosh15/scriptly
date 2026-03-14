import "./globals.css";
import { Suspense } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ThemeProvider from "@/providers/ThemeProvider";
import AntdConfigProvider from "@/providers/AntdConfigProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NavigationProgress from "@/components/NavigationProgress";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AntdRegistry>
          <ThemeProvider>
            <AntdConfigProvider>
              <Suspense>
                <NavigationProgress />
              </Suspense>
              <Navbar />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </AntdConfigProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
