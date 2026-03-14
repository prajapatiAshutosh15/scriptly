"use client";
import Link from "next/link";
import { Typography, Space, Divider, Button } from "antd";
import { TwitterOutlined, GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
import { SITE_NAME, FOOTER_LINKS } from "@/lib/constants";
import Logo from "@/components/brand/Logo";

const { Text, Paragraph } = Typography;

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-color)",
      background: "var(--footer-bg)",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "48px 24px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <Logo size={36} showText={true} textSize={20} />
            </div>
            <Paragraph type="secondary" style={{ fontSize: 13, lineHeight: 1.7 }}>
              Where developers share ideas and grow together. Write, discover, and connect with a community of builders.
            </Paragraph>
            <Space size={8} style={{ marginTop: 8 }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button type="text" shape="circle" icon={<TwitterOutlined />} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button type="text" shape="circle" icon={<GithubOutlined />} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button type="text" shape="circle" icon={<LinkedinOutlined />} />
              </a>
            </Space>
          </div>

          {/* Product Links */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>Product</Text>
            <Space orientation="vertical" size={8}>
              <Link href="/" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Home</Text></Link>
              <Link href="/explore" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Explore</Text></Link>
              <Link href="/write" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Write</Text></Link>
              <Link href="/pricing" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Pricing</Text></Link>
              <Link href="/bookmarks" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Bookmarks</Text></Link>
            </Space>
          </div>

          {/* Company Links */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>Company</Text>
            <Space orientation="vertical" size={8}>
              {FOOTER_LINKS.map((link) => (
                <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>{link.label}</Text>
                </Link>
              ))}
            </Space>
          </div>

          {/* Resources */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>Resources</Text>
            <Space orientation="vertical" size={8}>
              <Link href="/search" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Search</Text></Link>
              <Link href="/signin" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Sign In</Text></Link>
              <Link href="/contact" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 13 }}>Contact</Text></Link>
            </Space>
          </div>
        </div>

        <Divider style={{ margin: "32px 0 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </Text>
          <Space size={16}>
            <Link href="/privacy" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 12 }}>Privacy</Text></Link>
            <Link href="/terms" style={{ textDecoration: "none" }}><Text type="secondary" style={{ fontSize: 12 }}>Terms</Text></Link>
          </Space>
        </div>
      </div>
    </footer>
  );
}
