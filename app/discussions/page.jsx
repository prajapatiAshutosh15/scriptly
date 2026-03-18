"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Segmented, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import EmptyState from "@/components/shared/EmptyState";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuthStore } from "@/stores/authStore";
import { normalizeDiscussion } from "@/lib/normalizers";

export default function DiscussionsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { loading, fetchDiscussions, fetchCategories } = useDiscussions();
  const [discussions, setDiscussions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => { fetchCategories().then((d) => setCategories(d?.categories || [])); loadDiscussions(); }, []);
  useEffect(() => { loadDiscussions(); }, [activeCategory]);

  const loadDiscussions = async () => {
    const params = activeCategory !== "all" ? { category: activeCategory } : {};
    const data = await fetchDiscussions(params);
    setDiscussions((data?.discussions || []).map(normalizeDiscussion));
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Discussions</h1>
        <Button type="primary" shape="round" icon={<PlusOutlined />} size="large"
          onClick={() => isAuthenticated ? router.push("/discussions/new") : router.push("/signin")}>New Discussion</Button>
      </div>
      <Segmented options={[{ label: "All", value: "all" }, ...categories.map((c) => ({ label: c.name, value: c.slug }))]}
        value={activeCategory} onChange={setActiveCategory} style={{ marginBottom: 20 }} />
      <div style={{ background: "var(--nav-bg)", borderRadius: 16, border: "1px solid var(--border-color)", overflow: "hidden" }}>
        {loading ? <div style={{ padding: 20 }}><Skeleton active paragraph={{ rows: 8 }} /></div>
          : !discussions.length ? <EmptyState icon="💬" title="No discussions yet" description="Start one!" />
          : discussions.map((d) => <DiscussionCard key={d.id} discussion={d} />)}
      </div>
    </div>
  );
}
