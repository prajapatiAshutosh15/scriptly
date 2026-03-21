"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

export default function ArticleContent({ content }) {
  if (!content) return null;

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ children, id, ...props }) => (
            <h1 id={id} style={{ fontSize: 28, fontWeight: 800, margin: "28px 0 14px", lineHeight: 1.3, color: "var(--text-primary)" }} {...props}>{children}</h1>
          ),
          h2: ({ children, id, ...props }) => (
            <h2 id={id} style={{ fontSize: 22, fontWeight: 700, margin: "24px 0 10px", lineHeight: 1.3, paddingBottom: 8, borderBottom: "1px solid var(--border-color)", color: "var(--text-primary)" }} {...props}>{children}</h2>
          ),
          h3: ({ children, id, ...props }) => (
            <h3 id={id} style={{ fontSize: 18, fontWeight: 600, margin: "20px 0 8px", lineHeight: 1.4, color: "var(--text-primary)" }} {...props}>{children}</h3>
          ),
          p: ({ children }) => (
            <p style={{ margin: "14px 0", lineHeight: 1.8, fontSize: 15, color: "var(--text-primary)" }}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "14px 0", paddingLeft: 24, listStyleType: "disc" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "14px 0", paddingLeft: 24, listStyleType: "decimal" }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: "4px 0", lineHeight: 1.7, fontSize: 15, color: "var(--text-primary)" }}>{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: "4px solid var(--accent, #e5873a)",
              paddingLeft: 16,
              margin: "16px 0",
              color: "var(--text-secondary)",
              fontStyle: "italic",
            }}>{children}</blockquote>
          ),
          pre: ({ children }) => (
            <pre style={{
              background: "#0d1117",
              color: "#e6edf3",
              padding: "16px 20px",
              borderRadius: 8,
              overflow: "auto",
              margin: "16px 0",
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
              border: "1px solid #2a2a2a",
              position: "relative",
            }}>{children}</pre>
          ),
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code style={{
                  background: "rgba(229,135,58,0.1)",
                  color: "#e5873a",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
                }} {...props}>{children}</code>
              );
            }
            return (
              <code className={className} style={{
                fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
                fontSize: 13,
              }} {...props}>{children}</code>
            );
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--link-blue, #6db3f2)", textDecoration: "underline" }}>{children}</a>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} style={{ maxWidth: "100%", borderRadius: 8, margin: "16px 0" }} />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "16px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ border: "1px solid var(--border-color)", padding: "8px 12px", background: "var(--bg-surface)", fontWeight: 600, textAlign: "left", color: "var(--text-primary)" }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ border: "1px solid var(--border-color)", padding: "8px 12px", color: "var(--text-primary)" }}>{children}</td>
          ),
          hr: () => (
            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "24px 0" }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
