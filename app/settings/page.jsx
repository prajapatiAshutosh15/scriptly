"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Input, Button, Card, message, Avatar } from "antd";
import { useAuthStore } from "@/stores/authStore";
import { useUser } from "@/hooks/useUser";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateStoreUser = useAuthStore((s) => s.updateUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { updateProfile } = useUser();
  const [form, setForm] = useState({ name: "", bio: "", location: "", website: "", twitter: "", github: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.push("/signin"); }, []);
  useEffect(() => { if (user) setForm({ name: user.name || "", bio: user.bio || "", location: user.location || "", website: user.website || "", twitter: user.twitter || "", github: user.github || "" }); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updateProfile(user.username, form);
      updateStoreUser(data.user || form);
      message.success("Profile updated!");
    } catch (err) { message.error(err?.error?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const Field = ({ label, field, placeholder }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: "block", color: "var(--text-primary)" }}>{label}</label>
      <Input size="large" placeholder={placeholder} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} style={{ borderRadius: 8 }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "var(--text-primary)" }}>Settings</h1>
      <Tabs items={[
        { key: "profile", label: "Profile", children: (
          <Card style={{ borderRadius: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar src={user?.avatar} size={80} style={{ background: "#2563eb", fontSize: 32 }}>{user?.name?.[0]}</Avatar>
            </div>
            <Field label="Name" field="name" placeholder="Your name" />
            <Field label="Bio" field="bio" placeholder="Tell us about yourself" />
            <Field label="Location" field="location" placeholder="City, Country" />
            <Field label="Website" field="website" placeholder="https://yoursite.com" />
            <Field label="Twitter" field="twitter" placeholder="@handle" />
            <Field label="GitHub" field="github" placeholder="username" />
            <Button type="primary" shape="round" size="large" onClick={handleSave} loading={saving} style={{ marginTop: 8 }}>Save Changes</Button>
          </Card>
        )},
        { key: "account", label: "Account", children: (
          <Card style={{ borderRadius: 16 }}>
            <p style={{ color: "var(--text-secondary)" }}>Email: <strong>{user?.email}</strong></p>
            <p style={{ color: "var(--text-secondary)" }}>Username: <strong>@{user?.username}</strong></p>
            <p style={{ color: "var(--text-secondary)" }}>Plan: <strong>{user?.plan || "Free"}</strong></p>
          </Card>
        )},
      ]} />
    </div>
  );
}
