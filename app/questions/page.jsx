"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Segmented, Select, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QuestionList from "@/components/questions/QuestionList";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuthStore } from "@/stores/authStore";
import { useTags } from "@/hooks/useTags";

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

  useEffect(() => { fetchTags().then((data) => setTags(data?.tags || [])); }, []);
  useEffect(() => { loadQuestions(true); }, [sort, selectedTag]);

  const loadQuestions = async (reset = false) => {
    const p = reset ? 1 : page;
    const data = await fetchQuestions({ page: p, limit: 20, sort, tag: selectedTag || undefined });
    const list = data?.questions || [];
    setQuestions(reset ? list : [...questions, ...list]);
    setHasMore(data?.pagination?.hasNext || false);
    setPage(reset ? 2 : p + 1);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
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
    </div>
  );
}
