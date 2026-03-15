import Hero from "@/components/home/Hero";
import ArticleFeed from "@/components/home/ArticleFeed";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  // No server-side fetching — ArticleFeed and Sidebar fetch on client side
  // This makes the page load instantly, even if backend is cold starting
  return (
    <>
      <Hero />
      <div className="page-wrapper" style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "40px 24px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 40,
        }} className="home-grid">
          <ArticleFeed />
          <div className="sidebar-desktop">
            <div style={{ position: "sticky", top: 80 }}>
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
