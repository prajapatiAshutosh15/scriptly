import { notFound } from "next/navigation";
import { normalizeUser, normalizePost } from "@/lib/normalizers";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }) {
  const { username } = await params;
  try {
    const res = await fetch(API_URL + '/users/' + username, { cache: 'no-store' });
    if (!res.ok) return {};
    const json = await res.json();
    const user = normalizeUser(json.data);
    if (!user) return {};
    return { title: user.name, description: user.bio };
  } catch {
    return {};
  }
}

export default async function UserProfilePage({ params }) {
  const { username } = await params;

  // Fetch user profile
  const userRes = await fetch(API_URL + '/users/' + username, { cache: 'no-store' });
  if (!userRes.ok) notFound();
  const userJson = await userRes.json();
  const author = normalizeUser(userJson.data);
  if (!author) notFound();

  // Fetch user's posts
  let userPosts = [];
  try {
    const postsRes = await fetch(API_URL + '/users/' + username + '/posts', { cache: 'no-store' });
    if (postsRes.ok) {
      const postsJson = await postsRes.json();
      userPosts = (postsJson.data || []).map(normalizePost);
    }
  } catch {}

  return <ProfilePageContent author={author} userPosts={userPosts} />;
}
