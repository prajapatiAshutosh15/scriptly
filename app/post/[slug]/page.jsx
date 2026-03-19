import { notFound } from "next/navigation";
import { normalizePost, normalizeComment, extractList } from "@/lib/normalizers";
import PostPageContent from "@/components/articles/PostPageContent";
import { MOCK_POST_DETAILS } from "@/lib/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_DATA === "true";

async function fetchPost(slug) {
  if (USE_MOCK) {
    const mock = MOCK_POST_DETAILS[slug] || Object.values(MOCK_POST_DETAILS)[0];
    return mock || null;
  }
  try {
    const res = await fetch(`${API_URL}/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json.data;
  } catch {
    return null;
  }
}

async function fetchComments(postId, slug) {
  if (USE_MOCK) {
    const mock = MOCK_POST_DETAILS[slug] || Object.values(MOCK_POST_DETAILS)[0];
    return (mock?.comments || []).map(normalizeComment).filter(Boolean);
  }
  try {
    const res = await fetch(`${API_URL}/comments/post/${postId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    const list = extractList(json, 'comments');
    return list.map(normalizeComment).filter(Boolean);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const postData = await fetchPost(slug);
  if (!postData) return {};
  const post = normalizePost(postData);
  return { title: post?.title, description: post?.excerpt };
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  const postData = await fetchPost(slug);
  if (!postData) notFound();

  const post = normalizePost(postData);
  const postComments = await fetchComments(postData?.id, slug);

  return <PostPageContent post={post} postComments={postComments} relatedPosts={[]} />;
}
