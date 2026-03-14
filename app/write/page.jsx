"use client";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Modal, Tag, Space, Typography, message, Upload, Skeleton } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPublish, setShowPublish] = useState(false);
  const [tags, setTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
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
      api.get("/tags").then((res) => setTags(res.data || [])).catch(() => setTags([]));
    }
  }, [isAuthenticated]);

  // Load existing post for editing (wait for tags to load first)
  const [editLoading, setEditLoading] = useState(false);
  useEffect(() => {
    if (editSlug && isAuthenticated && tags.length > 0) {
      setIsEditMode(true);
      setEditLoading(true);
      api.get(`/posts/${editSlug}`).then((res) => {
        const post = res.data;
        if (post) {
          setTitle(post.title || "");
          setContent(post.content || "");
          setCoverImage(post.cover_image || "");
          if (post.tags && post.tags.length > 0) {
            setSelectedTags(post.tags.map((t) => t.id));
          }
        }
      }).catch(() => {
        message.error("Failed to load post for editing");
      }).finally(() => {
        setEditLoading(false);
      });
    }
  }, [editSlug, isAuthenticated, tags.length]);

  const toggleTag = useCallback((tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : prev.length < 5 ? [...prev, tagId] : prev
    );
  }, []);

  const handleAddCustomTag = useCallback(() => {
    const name = customTagInput.trim();
    if (!name) return;
    if (selectedTags.length >= 5) { message.warning("Maximum 5 tags"); return; }

    const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (!selectedTags.includes(existing.id)) setSelectedTags((prev) => [...prev, existing.id]);
    } else {
      const tempId = `custom-${Date.now()}`;
      setTags((prev) => [...prev, { id: tempId, name, slug: name.toLowerCase().replace(/\s+/g, "-"), isCustom: true }]);
      setSelectedTags((prev) => [...prev, tempId]);
    }
    setCustomTagInput("");
    setShowCustomTagInput(false);
  }, [customTagInput, tags, selectedTags]);

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

  const getTagPayload = useCallback(() => {
    const existingTagIds = selectedTags.filter((id) => typeof id === "number");
    const customTagNames = selectedTags
      .filter((id) => typeof id === "string" && id.startsWith("custom-"))
      .map((id) => tags.find((t) => t.id === id)?.name)
      .filter(Boolean);
    return { tags: existingTagIds, custom_tags: customTagNames };
  }, [selectedTags, tags]);

  const handlePublish = useCallback(async () => {
    if (!title.trim()) { message.warning("Please add a title"); return; }
    if (!content.trim()) { message.warning("Please add some content"); return; }
    setPublishing(true);
    try {
      const tagPayload = getTagPayload();
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
      const slug = res.data?.slug || editSlug;
      if (slug) router.push(`/post/${slug}`);
    } catch (err) {
      message.error(err?.error?.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }, [title, content, coverImage, getTagPayload, router]);

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) { message.warning("Please add a title"); return; }
    setSavingDraft(true);
    try {
      const tagPayload = getTagPayload();
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
  }, [title, content, coverImage, getTagPayload]);

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
          <RichTextEditor content={content} onChange={setContent} />
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {tags.map((tag) => (
                <Tag.CheckableTag
                  key={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                  style={{ borderRadius: 12, padding: "2px 12px", border: tag.isCustom ? "1px dashed #2563eb" : undefined }}
                >
                  {tag.isCustom ? `✨ ${tag.name}` : tag.name}
                </Tag.CheckableTag>
              ))}
            </div>
            {showCustomTagInput ? (
              <Space size={8}>
                <Input size="small" placeholder="Tag name..." value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)} onPressEnter={handleAddCustomTag}
                  style={{ width: 160, borderRadius: 8 }} autoFocus />
                <Button size="small" type="primary" onClick={handleAddCustomTag} shape="round">Add</Button>
                <Button size="small" onClick={() => { setShowCustomTagInput(false); setCustomTagInput(""); }} shape="round">Cancel</Button>
              </Space>
            ) : (
              <Button size="small" type="dashed" icon={<PlusOutlined />}
                onClick={() => setShowCustomTagInput(true)} shape="round"
                disabled={selectedTags.length >= 5}>Create Custom Tag</Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
