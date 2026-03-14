"use client";
import { useState, useCallback } from "react";
import { Avatar, Button, Input, Typography, Space, message } from "antd";
import { HeartOutlined, MessageOutlined } from "@ant-design/icons";
import { getRelativeTime } from "@/lib/utils";
import api from "@/services/api";
import { normalizeComment } from "@/lib/normalizers";
import { useAuthStore } from "@/stores/authStore";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function CommentSection({ slug, comments: initialComments }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      message.info("Sign in to comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/comments/post/" + slug, { content: newComment });
      const comment = normalizeComment(res.data);
      if (comment) {
        setComments((prev) => [comment, ...prev]);
      }
      setNewComment("");
    } catch (err) {
      message.error(err?.error?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }, [newComment, slug, isAuthenticated]);

  return (
    <div>
      <Text strong style={{ fontSize: 20, display: "block", marginBottom: 24 }}>
        <MessageOutlined /> Comments ({comments.length})
      </Text>

      {/* Add Comment */}
      <div style={{ marginBottom: 32 }}>
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment..."}
          rows={3}
          style={{ borderRadius: 12, resize: "none" }}
          disabled={!isAuthenticated}
        />
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            shape="round"
            onClick={handleSubmit}
            disabled={!newComment.trim() || !isAuthenticated}
            loading={submitting}
          >
            {isAuthenticated ? "Post Comment" : "Sign in to comment"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ display: "flex", gap: 12 }}>
            <Avatar src={comment.author.avatar} size={36}>
              {comment.author.name[0]}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Space size={8} align="center">
                <Text strong style={{ fontSize: 13 }}>{comment.author.name}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{getRelativeTime(comment.createdAt)}</Text>
              </Space>
              <Paragraph style={{ margin: "6px 0", fontSize: 14, lineHeight: 1.7 }}>
                {comment.content}
              </Paragraph>
              <Space size={16}>
                <Button type="text" size="small" icon={<HeartOutlined />} style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {comment.likes}
                </Button>
                <Button type="text" size="small" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Reply
                </Button>
              </Space>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
