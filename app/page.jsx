import LeftSidebar from "@/components/layout/LeftSidebar";
import PostComposer from "@/components/feed/PostComposer";
import ArticleFeed from "@/components/home/ArticleFeed";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "240px 1fr 320px",
      maxWidth: 1440,
      margin: "0 auto",
      minHeight: "calc(100vh - 64px)",
    }} className="app-layout">
      <LeftSidebar />
      <main style={{ padding: 24, minWidth: 0 }}>
        <PostComposer />
        <div style={{ marginTop: 20 }}>
          <ArticleFeed />
        </div>
      </main>
      <div style={{ padding: "24px 16px" }}>
        <div style={{ position: "sticky", top: 80 }}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
