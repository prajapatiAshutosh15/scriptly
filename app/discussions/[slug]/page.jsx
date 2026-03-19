"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, Tag, Divider, Skeleton, Button, Input, message } from "antd";
import { PushpinFilled, LockFilled } from "@ant-design/icons";
import ArticleContent from "@/components/articles/ArticleContent";
import UserMiniCard from "@/components/shared/UserMiniCard";
import EmptyState from "@/components/shared/EmptyState";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuthStore } from "@/stores/authStore";
import { normalizeDiscussion } from "@/lib/normalizers";
import { formatRelativeTime } from "@/lib/utils";
import { USE_MOCK, MOCK_DISCUSSION_DETAILS } from "@/lib/mockData";

export default function DiscussionDetailPage() {
  const { slug } = useParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { fetchBySlug, postReply } = useDiscussions();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadDiscussion(); }, [slug]);

  const loadDiscussion = async () => {
    setLoading(true);
    if (USE_MOCK) {
      const mockD = MOCK_DISCUSSION_DETAILS[slug] || Object.values(MOCK_DISCUSSION_DETAILS)[0];
      if (mockD) {
        setDiscussion(normalizeDiscussion(mockD));
        setReplies(mockD.replies || []);
      }
      setLoading(false);
      return;
    }
    try {
      const data = await fetchBySlug(slug);
      const d = data?.discussion;
      setDiscussion(normalizeDiscussion(d));
      setReplies(d?.replies || []);
    } catch { message.error("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    setSubmitting(true);
    try {
      await postReply(slug, { body: replyBody });
      setReplyBody("");
      message.success("Reply posted!");
      loadDiscussion();
    } catch (err) { message.error(err?.error?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}><Skeleton active paragraph={{ rows: 10 }} /></div>;
  if (!discussion) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {discussion.isPinned && <PushpinFilled style={{ color: "#f59e0b" }} />}
        {discussion.isLocked && <LockFilled style={{ color: "var(--text-secondary)" }} />}
        <Tag style={{ borderRadius: 12 }} color={discussion.categoryColor}>{discussion.categoryName}</Tag>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{discussion.title}</h1>
      <div style={{ marginTop: 12 }}>
        <UserMiniCard name={discussion.author.name} username={discussion.author.username} avatar={discussion.author.avatar} time={formatRelativeTime(discussion.createdAt)} />
      </div>
      <div style={{ marginTop: 20 }}><ArticleContent content={discussion.body} /></div>
      <Divider />
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{replies.length} Replies</h3>
      {replies.map((reply) => (
        <div key={reply.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Avatar src={reply.author_avatar} size={32} style={{ background: "#2563eb", flexShrink: 0 }}>{reply.author_name?.[0]}</Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{reply.author_name}</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatRelativeTime(reply.created_at)}</span>
              </div>
              <ArticleContent content={reply.body} />
            </div>
          </div>
        </div>
      ))}
      {!replies.length && <EmptyState icon="💬" title="No replies yet" description="Be the first!" />}
      {isAuthenticated && !discussion.isLocked && (
        <div style={{ marginTop: 24 }}>
          <Input.TextArea rows={4} placeholder="Write a reply..." value={replyBody} onChange={(e) => setReplyBody(e.target.value)} style={{ borderRadius: 12, marginBottom: 12 }} />
          <Button type="primary" shape="round" onClick={handleReply} loading={submitting}>Post Reply</Button>
        </div>
      )}
    </div>
  );
}
