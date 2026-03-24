"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Skeleton, message } from "antd";
import { FireOutlined, CheckOutlined } from "@ant-design/icons";
import api from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { MOCK_TAGS, MOCK_FEATURED, USE_MOCK } from "@/lib/mockData";

export default function Sidebar() {
  const [tags, setTags] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (USE_MOCK) { setTags(MOCK_TAGS); setTrending(MOCK_FEATURED); setLoading(false); return; }
      try {
        const [tagsRes, postsRes] = await Promise.all([
          api.get("/tags").catch(() => ({ success: false })),
          api.get("/posts?sort=popular&limit=5").catch(() => ({ success: false })),
        ]);

        if (tagsRes.success) {
          const tagList = Array.isArray(tagsRes.data)
            ? tagsRes.data
            : tagsRes.data?.tags || tagsRes.data?.data || [];
          setTags(tagList.length > 0 ? tagList : MOCK_TAGS);
        } else {
          setTags(MOCK_TAGS);
        }

        if (postsRes.success) {
          const postList = postsRes.data?.posts || postsRes.data || [];
          const list = Array.isArray(postList) ? postList : [];
          setTrending(
            list.length > 0
              ? list.slice(0, 5).map((p) => ({
                  id: p.id || p._id,
                  title: p.title,
                  likes: p.likes || p.likes_count || p.likesCount || 0,
                }))
              : MOCK_FEATURED
          );
        } else {
          setTrending(MOCK_FEATURED);
        }
      } catch {
        setTags(MOCK_TAGS);
        setTrending(MOCK_FEATURED);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [followedTags, setFollowedTags] = useState({});

  const handleFollowTag = useCallback(async (slug) => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    const isFollowing = followedTags[slug];
    setFollowedTags((prev) => ({ ...prev, [slug]: !isFollowing }));
    try {
      if (isFollowing) {
        await api.delete(`/tags/${slug}/follow`);
      } else {
        await api.post(`/tags/${slug}/follow`);
      }
    } catch {
      setFollowedTags((prev) => ({ ...prev, [slug]: isFollowing }));
      message.error("Failed");
    }
  }, [followedTags, isAuthenticated, router]);

  const suggestedTags = tags.slice(0, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Trending Topics */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <FireOutlined style={{ color: "#e5873a", fontSize: 16 }} />
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-primary)",
            }}
          >
            Trending Topics
          </span>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {trending.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "var(--text-secondary)",
                    opacity: 0.3,
                    lineHeight: 1,
                    minWidth: 32,
                    fontFamily: "monospace",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {item.likes} likes
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Tags */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
            display: "block",
            marginBottom: 16,
          }}
        >
          Suggested Tags
        </span>

        {loading ? (
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {suggestedTags.map((tag) => (
              <div
                key={tag.slug || tag.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Link
                    href={`/explore?tag=${tag.slug}`}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    #{tag.name}
                  </Link>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      marginTop: 1,
                    }}
                  >
                    {tag.postCount || tag.post_count || 0} posts
                  </div>
                </div>
                <Button
                  size="small"
                  shape="round"
                  icon={followedTags[tag.slug] ? <CheckOutlined /> : null}
                  onClick={() => handleFollowTag(tag.slug)}
                  type={followedTags[tag.slug] ? "default" : "default"}
                  style={{
                    borderColor: followedTags[tag.slug] ? "#22c55e" : "#e5873a",
                    color: followedTags[tag.slug] ? "#22c55e" : "#e5873a",
                    fontSize: 12,
                    height: 28,
                  }}
                >
                  {followedTags[tag.slug] ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
