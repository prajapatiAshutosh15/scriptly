"use client";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Modal, Select, Space, Typography, App, Upload, Skeleton } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "@/services/api";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const RichTextEditor = lazy(() => import("@/components/editor/RichTextEditor"));

const { Text } = Typography;

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { message } = App.useApp();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPublish, setShowPublish] = useState(false);
  const [tags, setTags] = useState([]);
  const [coverImage, setCoverImage] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/signin");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/tags").then((res) => setTags(res.data?.tags || res.data || [])).catch(() => setTags([]));
    }
  }, [isAuthenticated]);

  // Load existing post for editing (wait for tags to load first)
  const [editLoading, setEditLoading] = useState(false);
  useEffect(() => {
    if (editSlug && isAuthenticated && tags.length > 0) {
      setIsEditMode(true);
      setEditLoading(true);
      api.get(`/posts/${editSlug}`).then((res) => {
        const post = res.data?.post || res.data;
        if (post) {
          setTitle(post.title || "");
          setContent(post.content || "");
          setCoverImage(post.cover_image || "");
          if (post.tags && post.tags.length > 0) {
            setSelectedTags((post.tags || []).map((t) => t.name));
          }
        }
      }).catch(() => {
        message.error("Failed to load post for editing");
      }).finally(() => {
        setEditLoading(false);
      });
    }
  }, [editSlug, isAuthenticated, tags.length]);

  const handleCoverUpload = useCallback(async (file) => {
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const stored = localStorage.getItem("devblog-auth");
      const token = stored ? JSON.parse(stored)?.state?.token : null;
      const res = await axios.post(`${baseUrl}/uploads/cover`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      const filePath = res.data?.data?.file_path;
      if (filePath) { setCoverImage(filePath); message.success("Cover uploaded!"); }
    } catch {
      message.error("Upload failed");
    } finally {
      setCoverUploading(false);
    }
    return false;
  }, []);

  const buildTagPayload = useCallback(() => {
    const existingTagIds = [];
    const customTagNames = [];
    selectedTags.forEach((name) => {
      const found = tags.find((t) => (t.name || "").toLowerCase() === name.toLowerCase());
      if (found) existingTagIds.push(found.id);
      else customTagNames.push(name);
    });
    return { tags: existingTagIds, custom_tags: customTagNames };
  }, [selectedTags, tags]);

  const handlePublish = useCallback(async () => {
    if (!title.trim()) { message.warning("Please add a title"); return; }
    if (!content.trim()) { message.warning("Please add some content"); return; }
    setPublishing(true);
    try {
      const tagPayload = buildTagPayload();
      let res;
      if (isEditMode && editSlug) {
        res = await api.patch(`/posts/${editSlug}`, {
          title, content, cover_image: coverImage || null,
          ...tagPayload, status: "published",
        });
        message.success("Post updated!");
      } else {
        res = await api.post("/posts", {
          title, content, cover_image: coverImage || null,
          ...tagPayload, status: "published",
        });
        message.success("Published!");
      }
      setShowPublish(false);
      const slug = res.data?.post?.slug || res.data?.slug || editSlug;
      if (slug) router.push(`/post/${slug}`);
    } catch (err) {
      message.error(err?.error?.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }, [title, content, coverImage, buildTagPayload, router]);

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) { message.warning("Please add a title"); return; }
    setSavingDraft(true);
    try {
      const tagPayload = buildTagPayload();
      await api.post("/posts", {
        title, content, cover_image: coverImage || null,
        ...tagPayload, status: "draft",
      });
      message.success("Draft saved!");
    } catch (err) {
      message.error(err?.error?.message || "Failed to save");
    } finally {
      setSavingDraft(false);
    }
  }, [title, content, coverImage, buildTagPayload]);

  if (!isAuthenticated) return null;

  if (editLoading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <Skeleton active paragraph={{ rows: 1 }} title={{ width: "60%" }} />
        <Skeleton active paragraph={{ rows: 12 }} style={{ marginTop: 24 }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Title + Actions Bar */}
      <div style={{
        maxWidth: 800, margin: "0 auto", padding: "32px 24px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article Title..."
          variant="borderless"
          style={{ fontSize: 32, fontWeight: 800, padding: 0, flex: 1 }}
        />
        <Space>
          <Button shape="round" onClick={handleSaveDraft} loading={savingDraft}>Save Draft</Button>
          <Button type="primary" shape="round" onClick={() => setShowPublish(true)}>
            {isEditMode ? "Update" : "Publish"}
          </Button>
        </Space>
      </div>

      {/* Rich Text Editor */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 24px 48px" }}>
        <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} />}>
          <RichTextEditor content={content} onChange={setContent} sticky />
        </Suspense>
      </div>

      {/* Publish Modal */}
      <Modal
        title={isEditMode ? "Update Article" : "Publish Article"}
        open={showPublish}
        onCancel={() => setShowPublish(false)}
        onOk={handlePublish}
        okText={isEditMode ? "Update Now" : "Publish Now"}
        okButtonProps={{ shape: "round", loading: publishing }}
        cancelButtonProps={{ shape: "round" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
          {/* Cover Image */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Cover Image</Text>
            {coverImage ? (
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
                <img
                  src={coverImage.startsWith("http") ? coverImage : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "")}/${coverImage}`}
                  alt="Cover"
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12 }}
                />
                <Button danger size="small" icon={<DeleteOutlined />} onClick={() => setCoverImage("")}
                  style={{ position: "absolute", top: 8, right: 8 }}>Remove</Button>
              </div>
            ) : (
              <Upload.Dragger beforeUpload={handleCoverUpload} showUploadList={false} accept="image/*" disabled={coverUploading}>
                <p style={{ fontSize: 24, color: "var(--text-secondary)" }}>
                  {coverUploading ? "Uploading..." : <UploadOutlined />}
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Click or drag an image</p>
              </Upload.Dragger>
            )}
          </div>

          {/* Tags */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>Tags (max 5)</Text>
            <Select mode="tags" placeholder="Type to add tags (up to 5)" maxCount={5} style={{ width: "100%" }}
              tokenSeparators={[","]}
              value={selectedTags} onChange={setSelectedTags}
              options={tags.map((t) => ({ label: t.name, value: t.name }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
