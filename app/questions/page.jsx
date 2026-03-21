"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Segmented, Select, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LeftSidebar from "@/components/layout/LeftSidebar";
import Sidebar from "@/components/layout/Sidebar";
import QuestionList from "@/components/questions/QuestionList";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuthStore } from "@/stores/authStore";
import { useTags } from "@/hooks/useTags";
import { MOCK_QUESTIONS, MOCK_TAGS as MOCK_TAGS_DATA, USE_MOCK } from "@/lib/mockData";

export default function QuestionsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { loading, fetchQuestions } = useQuestions();
  const { fetchTags } = useTags();

  const [questions, setQuestions] = useState([]);
  const [sort, setSort] = useState("latest");
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { if (USE_MOCK) { setTags(MOCK_TAGS_DATA); return; } fetchTags().then((data) => { const t = data?.tags || []; setTags(t.length > 0 ? t : MOCK_TAGS_DATA); }).catch(() => setTags(MOCK_TAGS_DATA)); }, []);
  useEffect(() => { loadQuestions(true); }, [sort, selectedTag]);

  const loadQuestions = async (reset = false) => {
    if (USE_MOCK) { setQuestions(MOCK_QUESTIONS); setHasMore(false); return; }
    const p = reset ? 1 : page;
    let data;
    try { data = await fetchQuestions({ page: p, limit: 20, sort, tag: selectedTag || undefined }); } catch { data = null; }
    const list = data?.questions || [];
    const finalList = list.length > 0 ? list : (reset ? MOCK_QUESTIONS : []);
    setQuestions(reset ? finalList : [...questions, ...finalList]);
    setHasMore(data?.pagination?.hasNext || false);
    setPage(reset ? 2 : p + 1);
  };

  return (
    <div className="app-layout">
      <LeftSidebar />
      <main className="main-feed">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Questions</h1>
          <Button type="primary" shape="round" icon={<PlusOutlined />} size="large"
            onClick={() => isAuthenticated ? router.push("/questions/ask") : router.push("/signin")}>
            Ask Question
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <Segmented options={["latest", "votes", "unanswered", "active"].map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v }))} value={sort} onChange={setSort} />
          <Select placeholder="Filter by tag" allowClear style={{ width: 200 }} value={selectedTag}
            onChange={setSelectedTag} options={tags.map((t) => ({ label: t.name, value: t.slug }))} />
        </div>
        <div style={{ background: "var(--nav-bg)", borderRadius: 16, border: "1px solid var(--border-color)", overflow: "hidden" }}>
          <QuestionList questions={questions} loading={loading && !questions.length} />
        </div>
        {hasMore && !loading && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Button shape="round" onClick={() => loadQuestions()} loading={loading}>Load More</Button>
          </div>
        )}
      </main>
      <div className="right-sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
