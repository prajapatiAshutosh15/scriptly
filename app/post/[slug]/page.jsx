import { notFound } from "next/navigation";
import { normalizePost, normalizeComment } from "@/lib/normalizers";
import PostPageContent from "@/components/articles/PostPageContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(API_URL + '/posts/' + slug, { cache: 'no-store' });
    if (!res.ok) return {};
    const json = await res.json();
    const post = normalizePost(json.data);
    if (!post) return {};
    return { title: post.title, description: post.excerpt };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  // Fetch post
  const postRes = await fetch(API_URL + '/posts/' + slug, { cache: 'no-store' });
  if (!postRes.ok) notFound();
  const postJson = await postRes.json();
  const post = normalizePost(postJson.data);
  if (!post) notFound();

  // Fetch comments
  let postComments = [];
  try {
    const commentsRes = await fetch(API_URL + '/comments/post/' + slug, { cache: 'no-store' });
    if (commentsRes.ok) {
      const commentsJson = await commentsRes.json();
      postComments = (commentsJson.data || []).map(normalizeComment);
    }
  } catch {}

  // Fetch related posts
  let relatedPosts = [];
  try {
    const relatedRes = await fetch(API_URL + '/posts/' + slug + '/related', { cache: 'no-store' });
    if (relatedRes.ok) {
      const relatedJson = await relatedRes.json();
      relatedPosts = (relatedJson.data || []).map(normalizePost);
    }
  } catch {}

  return <PostPageContent post={post} postComments={postComments} relatedPosts={relatedPosts} />;
}
