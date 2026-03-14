import Hero from "@/components/home/Hero";
import ArticleFeed from "@/components/home/ArticleFeed";
import Sidebar from "@/components/layout/Sidebar";
import { normalizePost } from "@/lib/normalizers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchPosts() {
  try {
    const res = await fetch(API_URL + "/posts?limit=12", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    return (json.data || []).map(normalizePost).filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchTags() {
  try {
    const res = await fetch(API_URL + "/tags", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    return json.data || [];
  } catch {
    return [];
  }
}

async function fetchFeaturedPosts() {
  try {
    const res = await fetch(API_URL + "/posts?featured=true&limit=3", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success) return [];
    return (json.data || []).map(normalizePost).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [posts, tags, featuredPosts] = await Promise.all([
    fetchPosts(),
    fetchTags(),
    fetchFeaturedPosts(),
  ]);

  return (
    <>
      <Hero />
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "40px 24px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 40,
        }} className="home-grid">
          <ArticleFeed initialPosts={posts} />
          <div className="sidebar-desktop">
            <div style={{ position: "sticky", top: 80 }}>
              <Sidebar tags={tags} featuredPosts={featuredPosts} />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
