import LeftSidebar from "@/components/layout/LeftSidebar";
import PostComposer from "@/components/feed/PostComposer";
import ArticleFeed from "@/components/home/ArticleFeed";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="app-layout">
      <LeftSidebar />
      <main className="main-feed">
        <PostComposer />
        <div style={{ marginTop: 20 }}>
          <ArticleFeed />
        </div>
      </main>
      <div className="right-sidebar">
        <Sidebar />
      </div>
    </div>
  );
}
