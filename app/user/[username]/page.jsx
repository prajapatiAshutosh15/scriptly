import { notFound } from "next/navigation";
import { normalizeUser, normalizePost, extractList } from "@/lib/normalizers";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchUser(username) {
  try {
    const res = await fetch(`${API_URL}/users/${username}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return normalizeUser(json.data);
  } catch {
    return null;
  }
}

async function fetchUserPosts(username) {
  try {
    const res = await fetch(`${API_URL}/posts?author=${username}&limit=20`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    const list = extractList(json, 'posts');
    return list.map(normalizePost).filter(Boolean);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const user = await fetchUser(username);
  if (!user) return {};
  return { title: user.name, description: user.bio };
}

export default async function UserProfilePage({ params }) {
  const { username } = await params;

  const [author, userPosts] = await Promise.all([
    fetchUser(username),
    fetchUserPosts(username),
  ]);

  if (!author) notFound();

  return <ProfilePageContent author={author} userPosts={userPosts} />;
}
