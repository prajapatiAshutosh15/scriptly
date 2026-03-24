"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Card, Button, Empty, Skeleton, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import api from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { getRelativeTime } from "@/lib/utils";

const { Title, Text, Paragraph } = Typography;

export default function DraftsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/signin"); return; }
    fetchDrafts();
  }, [isAuthenticated]);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts/drafts");
      setDrafts(res.data?.posts || res.data || []);
    } catch {
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    try {
      await api.delete(`/posts/${slug}`);
      message.success("Draft deleted");
      setDrafts((prev) => prev.filter((d) => d.slug !== slug));
    } catch {
      message.error("Failed to delete");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <EditOutlined style={{ marginRight: 12 }} />
            My Drafts
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Unpublished articles</Text>
        </div>
        <Link href="/write">
          <Button type="primary" shape="round" icon={<PlusOutlined />}>New Post</Button>
        </Link>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={{ borderRadius: 16 }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      ) : drafts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {drafts.map((draft) => (
            <Card key={draft.id} hoverable style={{ borderRadius: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/write?edit=${draft.slug}`} style={{ textDecoration: "none" }}>
                    <Text strong style={{ fontSize: 16, color: "var(--text-primary)", display: "block" }}>
                      {draft.title || "Untitled Draft"}
                    </Text>
                  </Link>
                  {draft.excerpt && (
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: "8px 0 0", fontSize: 13 }}>
                      {draft.excerpt}
                    </Paragraph>
                  )}
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>
                    Last edited {getRelativeTime(draft.updated_at || draft.created_at)}
                  </Text>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Link href={`/write?edit=${draft.slug}`}>
                    <Button shape="round" icon={<EditOutlined />}>Edit</Button>
                  </Link>
                  <Popconfirm title="Delete this draft?" onConfirm={() => handleDelete(draft.slug)} okText="Delete" okButtonProps={{ danger: true }}>
                    <Button shape="round" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card style={{ borderRadius: 20, textAlign: "center", padding: 40 }}>
          <Empty
            image={<EditOutlined style={{ fontSize: 60, color: "#d1d5db" }} />}
            description={
              <div>
                <Title level={4} style={{ margin: "16px 0 8px" }}>No drafts yet</Title>
                <Paragraph type="secondary">Start writing and save drafts to continue later.</Paragraph>
              </div>
            }
          >
            <Link href="/write">
              <Button type="primary" shape="round" icon={<PlusOutlined />} size="large">
                Write New Post
              </Button>
            </Link>
          </Empty>
        </Card>
      )}
    </div>
  );
}
