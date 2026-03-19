"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Segmented, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LeftSidebar from "@/components/layout/LeftSidebar";
import Sidebar from "@/components/layout/Sidebar";
import DiscussionCard from "@/components/discussions/DiscussionCard";
import EmptyState from "@/components/shared/EmptyState";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuthStore } from "@/stores/authStore";
import { normalizeDiscussion } from "@/lib/normalizers";
import { MOCK_DISCUSSIONS, MOCK_CATEGORIES, USE_MOCK } from "@/lib/mockData";

export default function DiscussionsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { loading, fetchDiscussions, fetchCategories } = useDiscussions();
  const [discussions, setDiscussions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => { if (USE_MOCK) { setCategories(MOCK_CATEGORIES); } else { fetchCategories().then((d) => { const cats = d?.categories || []; setCategories(cats.length > 0 ? cats : MOCK_CATEGORIES); }).catch(() => setCategories(MOCK_CATEGORIES)); } loadDiscussions(); }, []);
  useEffect(() => { loadDiscussions(); }, [activeCategory]);

  const loadDiscussions = async () => {
    if (USE_MOCK) { setDiscussions(MOCK_DISCUSSIONS); return; }
    const params = activeCategory !== "all" ? { category: activeCategory } : {};
    let data;
    try { data = await fetchDiscussions(params); } catch { data = null; }
    const list = (data?.discussions || []).map(normalizeDiscussion);
    setDiscussions(list.length > 0 ? list : MOCK_DISCUSSIONS);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 320px", maxWidth: 1440, margin: "0 auto", minHeight: "calc(100vh - 64px)" }} className="app-layout">
      <LeftSidebar />
      <main style={{ padding: 24, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Discussions</h1>
          <Button type="primary" shape="round" icon={<PlusOutlined />} size="large"
            onClick={() => isAuthenticated ? router.push("/discussions/new") : router.push("/signin")}>New Discussion</Button>
        </div>
        <Segmented options={[{ label: "All", value: "all" }, ...categories.map((c) => ({ label: c.name, value: c.slug }))]}
          value={activeCategory} onChange={setActiveCategory} style={{ marginBottom: 20 }} />
        <div style={{ background: "var(--nav-bg)", borderRadius: 16, border: "1px solid var(--border-color)", overflow: "hidden" }}>
          {loading ? <div style={{ padding: 20 }}><Skeleton active paragraph={{ rows: 8 }} /></div>
            : !discussions.length ? <EmptyState icon="..." title="No discussions yet" description="Start one!" />
            : discussions.map((d) => <DiscussionCard key={d.id} discussion={d} />)}
        </div>
      </main>
      <div style={{ padding: "24px 16px" }}>
        <Sidebar />
      </div>
    </div>
  );
}
