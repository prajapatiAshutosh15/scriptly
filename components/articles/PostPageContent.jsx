"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Tag, Avatar, Typography, Space, Divider, Button, Popconfirm, message } from "antd";
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ArticleContent from "./ArticleContent";
import ReactionBar from "./ReactionBar";
import CommentSection from "./CommentSection";
import ArticleCard from "./ArticleCard";
import { getDefaultCover, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import api from "@/services/api";

const { Title, Text } = Typography;

export default function PostPageContent({ post, postComments, relatedPosts }) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthor = currentUser?.id === post.author?.id || currentUser?.username === post.author?.username;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${post.slug}`);
      message.success("Post deleted");
      router.push("/");
    } catch (err) {
      message.error(err?.error?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }, [post.slug, router]);
  // Extract headings from Markdown (## Heading) and HTML (<h2>Heading</h2>)
  const tocItems = [];
  if (post.content) {
    // Markdown headings: ## Title
    const mdHeadings = post.content.match(/^#{2,3}\s+(.+)$/gm);
    if (mdHeadings) {
      mdHeadings.forEach((h) => {
        const level = h.match(/^(#+)/)[1].length;
        const text = h.replace(/^#+\s+/, "").trim();
        const id = text.toLowerCase().replace(/[^\w]+/g, "-");
        tocItems.push({ text, id, level });
      });
    }
    // HTML headings: <h2>Title</h2>
    const htmlHeadings = post.content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g);
    if (htmlHeadings && tocItems.length === 0) {
      htmlHeadings.forEach((h) => {
        const level = parseInt(h[2]);
        const text = h.replace(/<\/?h[23][^>]*>/g, "").trim();
        const id = text.toLowerCase().replace(/[^\w]+/g, "-");
        tocItems.push({ text, id, level });
      });
    }
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      {/* Cover Image */}
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 32,
        height: 400,
        maxHeight: "50vh",
      }} className="post-cover">
        <img
          src={post.coverImage || getDefaultCover(post.slug || post.id)}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.currentTarget.src = getDefaultCover(); }}
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 220px",
        gap: 32,
      }} className="post-grid">
        {/* Reaction Bar - Desktop */}
        <div className="reaction-desktop">
          <div style={{ position: "sticky", top: 80 }}>
            <ReactionBar
              slug={post.slug}
              postId={post.id}
              initialLikes={post.likes}
              initialIsLiked={post.isLiked}
              initialIsBookmarked={post.isBookmarked}
            />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 740, minWidth: 0 }}>
          <Space size={6} wrap style={{ marginBottom: 16 }}>
            {post.tags.map((tag) => (
              <Tag key={tag.id || tag.slug || tag} color="blue" style={{ borderRadius: 12 }}>{tag.name || tag}</Tag>
            ))}
          </Space>

          <Title level={1} style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: "0 0 24px" }}>
            {post.title}
          </Title>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingBottom: 24,
            marginBottom: 32,
            borderBottom: "1px solid var(--border-color)",
          }} className="post-author-section">
            <Link href={`/user/${post.author.username}`}>
              <Avatar src={post.author.avatar} size={56}>{post.author.name[0]}</Avatar>
            </Link>
            <div style={{ flex: 1 }}>
              <Link href={`/user/${post.author.username}`} style={{ textDecoration: "none" }}>
                <Text strong style={{ fontSize: 16 }}>{post.author.name}</Text>
              </Link>
              <div style={{ marginTop: 4 }}>
                <Space size={16}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <CalendarOutlined /> {formatDate(post.publishedAt)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <ClockCircleOutlined /> {post.readTime} min read
                  </Text>
                </Space>
              </div>
            </div>

            {/* Author Actions */}
            {isAuthor && (
              <Space size={8}>
                <Link href={`/write?edit=${post.slug}`}>
                  <Button icon={<EditOutlined />} shape="round" size="small">
                    Edit
                  </Button>
                </Link>
                <Popconfirm
                  title="Delete this post?"
                  description="This action cannot be undone."
                  onConfirm={handleDelete}
                  okText="Delete"
                  okButtonProps={{ danger: true, loading: deleting }}
                >
                  <Button danger icon={<DeleteOutlined />} shape="round" size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </div>

          <ArticleContent content={post.content} />

          <div className="reaction-mobile" style={{ display: "none", margin: "32px 0" }}>
            <ReactionBar
              slug={post.slug}
              postId={post.id}
              initialLikes={post.likes}
              initialIsLiked={post.isLiked}
              initialIsBookmarked={post.isBookmarked}
            />
          </div>

          <Divider />
          <CommentSection postId={post.id} comments={postComments} />
        </div>

        {/* TOC - Desktop */}
        <div className="toc-desktop">
          <div style={{ position: "sticky", top: 80 }}>
            <Card size="small" title="Table of Contents" style={{ borderRadius: 16 }}>
              {tocItems.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {tocItems.map((item, i) => (
                    <a
                      key={i}
                      href={`#${item.id}`}
                      style={{
                        fontSize: 13,
                        cursor: "pointer",
                        lineHeight: 1.5,
                        textDecoration: "none",
                        color: "var(--text-secondary)",
                        paddingLeft: item.level === 3 ? 16 : 0,
                        display: "block",
                      }}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              ) : (
                <Text type="secondary" style={{ fontSize: 13 }}>No headings found</Text>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <Divider />
          <Title level={3} style={{ marginBottom: 24 }}>More Articles</Title>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {relatedPosts.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
