"use client";
import { useState, useEffect, useCallback } from "react";
import { Typography, Card, Button, Empty, Skeleton } from "antd";
import { BookOutlined, ReadOutlined, LoginOutlined } from "@ant-design/icons";
import Link from "next/link";
import api from "@/services/api";
import { normalizePost } from "@/lib/normalizers";
import { useAuthStore } from "@/stores/authStore";
import ArticleCard from "@/components/articles/ArticleCard";

const { Title, Text, Paragraph } = Typography;

export default function BookmarksPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookmarks");
      const list = res.data?.posts || res.data || [];
      const posts = (Array.isArray(list) ? list : [])
        .map((bookmark) => normalizePost(bookmark.post || bookmark))
        .filter(Boolean);
      setBookmarkedPosts(posts);
    } catch {
      setBookmarkedPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchBookmarks]);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <Card style={{ borderRadius: 20, textAlign: "center", padding: 40 }}>
          <Empty
            image={<BookOutlined style={{ fontSize: 60, color: "#d1d5db" }} />}
            description={
              <div>
                <Title level={4} style={{ margin: "16px 0 8px" }}>Sign in to see your bookmarks</Title>
                <Paragraph type="secondary">You need to be logged in to view your saved articles.</Paragraph>
              </div>
            }
          >
            <Link href="/signin">
              <Button type="primary" shape="round" icon={<LoginOutlined />} size="large">
                Sign In
              </Button>
            </Link>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: 12 }} />
            Bookmarks
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Articles you&apos;ve saved for later</Text>
        </div>
      </div>

      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {[1, 2, 3].map((i) => (
            <Card key={i} style={{ borderRadius: 16 }}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      ) : bookmarkedPosts.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {bookmarkedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card style={{ borderRadius: 20, textAlign: "center", padding: 40 }}>
          <Empty
            image={<BookOutlined style={{ fontSize: 60, color: "#d1d5db" }} />}
            description={
              <div>
                <Title level={4} style={{ margin: "16px 0 8px" }}>No bookmarks yet</Title>
                <Paragraph type="secondary">Start reading and bookmark articles you want to revisit later.</Paragraph>
              </div>
            }
          >
            <Link href="/explore">
              <Button type="primary" shape="round" icon={<ReadOutlined />} size="large">
                Explore Articles
              </Button>
            </Link>
          </Empty>
        </Card>
      )}
    </div>
  );
}
