"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Space, Typography, Tooltip } from "antd";
import { HeartOutlined, HeartFilled, BookOutlined, BookFilled, ShareAltOutlined } from "@ant-design/icons";
import api from "@/services/api";
import { useAuthStore } from "@/stores/authStore";

const { Text } = Typography;

export default function ReactionBar({ slug, postId, initialLikes = 0, initialIsLiked = false, initialIsBookmarked = false }) {
  const [liked, setLiked] = useState(initialIsLiked);
  const [bookmarked, setBookmarked] = useState(initialIsBookmarked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleLike = useCallback(async () => {
    try {
      if (liked) {
        await api.delete(`/posts/${slug}/like`);
        setLiked(false);
        setLikeCount((c) => c - 1);
      } else {
        await api.post(`/posts/${slug}/like`);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch {}
  }, [liked, slug, isAuthenticated, router]);

  const handleBookmark = useCallback(async () => {
    if (!isAuthenticated) { router.push("/signin"); return; }
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/post/${postId}`);
        setBookmarked(false);
      } else {
        await api.post(`/bookmarks/post/${postId}`);
        setBookmarked(true);
      }
    } catch {}
  }, [bookmarked, postId, isAuthenticated, router]);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  return (
    <Space orientation="vertical" align="center" size={8} style={{ width: "100%" }}>
      <Tooltip title="Like">
        <Button type="text" shape="circle" size="large"
          icon={liked ? <HeartFilled style={{ color: "#ef4444" }} /> : <HeartOutlined />}
          onClick={handleLike} />
      </Tooltip>
      <Text type="secondary" style={{ fontSize: 12 }}>{likeCount}</Text>
      <Tooltip title="Bookmark">
        <Button type="text" shape="circle" size="large"
          icon={bookmarked ? <BookFilled style={{ color: "#2563eb" }} /> : <BookOutlined />}
          onClick={handleBookmark} />
      </Tooltip>
      <Tooltip title="Share link">
        <Button type="text" shape="circle" size="large"
          icon={<ShareAltOutlined />} onClick={handleShare} />
      </Tooltip>
    </Space>
  );
}
