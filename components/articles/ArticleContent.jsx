"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

export default function ArticleContent({ content }) {
  if (!content) return null;

  return (
    <div className="prose max-w-none text-gray-800 dark:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeRaw]}
        components={{
          // Custom heading renderers with IDs for TOC linking
          h1: ({ children, id, ...props }) => (
            <h1 id={id} style={{ fontSize: 32, fontWeight: 800, margin: "32px 0 16px", lineHeight: 1.3 }} {...props}>{children}</h1>
          ),
          h2: ({ children, id, ...props }) => (
            <h2 id={id} style={{ fontSize: 24, fontWeight: 700, margin: "28px 0 12px", lineHeight: 1.3, paddingBottom: 8, borderBottom: "1px solid var(--border-color)" }} {...props}>{children}</h2>
          ),
          h3: ({ children, id, ...props }) => (
            <h3 id={id} style={{ fontSize: 20, fontWeight: 600, margin: "24px 0 8px", lineHeight: 1.4 }} {...props}>{children}</h3>
          ),
          p: ({ children }) => (
            <p style={{ margin: "16px 0", lineHeight: 1.8, fontSize: 16 }}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "16px 0", paddingLeft: 24, listStyleType: "disc" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "16px 0", paddingLeft: 24, listStyleType: "decimal" }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: "6px 0", lineHeight: 1.7 }}>{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: "4px solid #2563eb",
              paddingLeft: 16,
              margin: "20px 0",
              color: "var(--text-secondary)",
              fontStyle: "italic",
            }}>{children}</blockquote>
          ),
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code style={{
                  background: "var(--code-bg, rgba(37,99,235,0.1))",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                }} {...props}>{children}</code>
              );
            }
            return (
              <pre style={{
                background: "var(--code-block-bg, #1e293b)",
                color: "#e2e8f0",
                padding: 20,
                borderRadius: 12,
                overflow: "auto",
                margin: "20px 0",
                fontSize: 14,
                lineHeight: 1.6,
              }}>
                <code className={className} {...props}>{children}</code>
              </pre>
            );
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>{children}</a>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} style={{ maxWidth: "100%", borderRadius: 12, margin: "20px 0" }} />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ border: "1px solid var(--border-color)", padding: "10px 14px", background: "var(--code-bg, rgba(0,0,0,0.05))", fontWeight: 600, textAlign: "left" }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ border: "1px solid var(--border-color)", padding: "10px 14px" }}>{children}</td>
          ),
          hr: () => (
            <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "32px 0" }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
