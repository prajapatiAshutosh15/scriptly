"use client";
import { useState, useEffect } from "react";
import { Typography, Card, Input, Button, Divider, Space, App } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/brand/Logo";

const { Title, Text } = Typography;

export default function SignInPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { isAuthenticated, login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegisterMode) {
        await register(form);
        message.success("Account created successfully!");
      } else {
        await login(form.email, form.password);
        message.success("Signed in successfully!");
      }
      router.push("/");
    } catch (err) {
      message.error(err?.error?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    setForm({ name: "", username: "", email: "", password: "" });
  };

  if (isAuthenticated) return null;

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(229,135,58,0.03) 100%)",
    }}>
      <Card style={{ maxWidth: 440, width: "100%", borderRadius: 24, padding: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ marginBottom: 16, display: "inline-block" }}>
            <Logo size={48} showText={false} />
          </div>
          <Title level={3} style={{ margin: 0 }}>
            {isRegisterMode ? "Create your account" : "Welcome back"}
          </Title>
          <Text type="secondary">
            {isRegisterMode ? "Join the Scriptly community" : "Sign in to continue to Scriptly"}
          </Text>
        </div>

        {/* Social Login */}
        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
          <Button block size="large" icon={<GithubOutlined />} style={{ borderRadius: 12, height: 48, fontWeight: 500 }}>
            Continue with GitHub
          </Button>
          <Button block size="large" icon={<GoogleOutlined />} style={{ borderRadius: 12, height: 48, fontWeight: 500 }}>
            Continue with Google
          </Button>
        </Space>

        <Divider>{isRegisterMode ? "or register with email" : "or sign in with email"}</Divider>

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            {isRegisterMode && (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Full Name</label>
                  <Input
                    placeholder="John Doe"
                    prefix={<UserOutlined />}
                    size="large"
                    style={{ borderRadius: 12 }}
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Username</label>
                  <Input
                    placeholder="johndoe"
                    prefix={<UserOutlined />}
                    size="large"
                    style={{ borderRadius: 12 }}
                    value={form.username}
                    onChange={handleChange("username")}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email</label>
              <Input
                placeholder="you@example.com"
                prefix={<MailOutlined />}
                size="large"
                type="email"
                style={{ borderRadius: 12 }}
                value={form.email}
                onChange={handleChange("email")}
                required
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
                {!isRegisterMode && (
                  <Link href="#" style={{ fontSize: 13, color: "#2563eb" }}>Forgot password?</Link>
                )}
              </div>
              <Input.Password
                placeholder={isRegisterMode ? "Create a password (6+ chars)" : "Enter your password"}
                prefix={<LockOutlined />}
                size="large"
                style={{ borderRadius: 12 }}
                value={form.password}
                onChange={handleChange("password")}
                required
                minLength={6}
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              shape="round"
              loading={loading}
              style={{ height: 48, fontWeight: 600 }}
            >
              {isRegisterMode ? "Create Account" : "Sign In"}
            </Button>
          </Space>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary">
            {isRegisterMode ? "Already have an account? " : "Don\u0027t have an account? "}
          </Text>
          <a onClick={toggleMode} style={{ color: "#2563eb", fontWeight: 500, cursor: "pointer" }}>
            {isRegisterMode ? "Sign in" : "Sign up"}
          </a>
        </div>
      </Card>
    </div>
  );
}
