"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Avatar, Tag, Spin } from "antd";
import {
  SearchOutlined, FileTextOutlined, QuestionCircleOutlined,
  TagOutlined, UserOutlined, ClockCircleOutlined, CloseOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getDefaultAvatar } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";

const STORAGE_KEY = "tle-recent-searches";
const MAX_RECENT = 8;

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveRecent(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
}
function addRecent(q) {
  const list = loadRecent().filter((s) => s !== q);
  list.unshift(q);
  saveRecent(list);
}
function removeRecent(q) {
  saveRecent(loadRecent().filter((s) => s !== q));
}

const TYPE_ICONS = {
  post: <FileTextOutlined style={{ color: "#2563eb" }} />,
  question: <QuestionCircleOutlined style={{ color: "#22c55e" }} />,
  tag: <TagOutlined style={{ color: "#e5873a" }} />,
  user: <UserOutlined style={{ color: "#8b5cf6" }} />,
};

const TYPE_LABELS = { posts: "Posts", questions: "Questions", tags: "Tags", users: "Users" };

export default function SearchDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { suggest } = useSearch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Load recent on mount
  useEffect(() => {
    setRecentSearches(loadRecent());
  }, []);

  // Sync search bar text with URL query when on /search page
  useEffect(() => {
    if (pathname === "/search") {
      const urlQuery = searchParams.get("q") || "";
      setQuery(urlQuery);
    }
  }, [pathname, searchParams]);

  // Click outside to close
  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Debounced suggest
  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await suggest(val.trim());
      if (data) setResults(data);
      setLoading(false);
    }, 300);
  }, [suggest]);

  // Flatten results for keyboard navigation
  const flatItems = [];
  if (results) {
    for (const [group, items] of Object.entries(results)) {
      for (const item of items) {
        flatItems.push({ ...item, group });
      }
    }
  }

  const navigate = useCallback((url) => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
    router.push(url);
  }, [router]);

  const goToSearch = useCallback(() => {
    if (!query.trim()) return;
    addRecent(query.trim());
    setRecentSearches(loadRecent());
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, router]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        navigate(flatItems[activeIndex].url);
      } else {
        goToSearch();
      }
    }
  }, [activeIndex, flatItems, navigate, goToSearch]);

  const handleFocus = () => {
    setIsOpen(true);
    setRecentSearches(loadRecent());
  };

  const handleRecentClick = (q) => {
    setQuery(q);
    addRecent(q);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleRemoveRecent = (e, q) => {
    e.stopPropagation();
    removeRecent(q);
    setRecentSearches(loadRecent());
  };

  const showRecent = isOpen && !query.trim() && recentSearches.length > 0;
  const showResults = isOpen && query.trim().length >= 2;
  const hasResults = results && flatItems.length > 0;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <Input
        ref={inputRef}
        placeholder="Search posts, questions, tags, users..."
        prefix={<SearchOutlined style={{ color: "var(--text-secondary)", fontSize: 15 }} />}
        suffix={
          loading ? <Spin size="small" /> :
          <span style={{ fontSize: 11, color: "var(--text-secondary)", opacity: 0.5, background: "var(--bg-surface-hover, rgba(255,255,255,0.06))", padding: "2px 8px", borderRadius: 6 }}>Ctrl+K</span>
        }
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        size="large"
        style={{
          borderRadius: 24,
          fontSize: 14,
          border: "1px solid var(--border-color)",
          background: "var(--bg-surface)",
          height: 42,
        }}
        allowClear
        onClear={() => { setQuery(""); setResults(null); }}
      />

      {/* Dropdown */}
      {(showRecent || showResults) && (
        <div className="search-dropdown-overlay">
          {/* Recent Searches */}
          {showRecent && (
            <>
              <div className="search-dropdown-category">
                <ClockCircleOutlined /> Recent Searches
              </div>
              {recentSearches.map((q) => (
                <div
                  key={q}
                  className="search-dropdown-item"
                  onClick={() => handleRecentClick(q)}
                >
                  <ClockCircleOutlined style={{ color: "var(--text-secondary)", fontSize: 14 }} />
                  <span style={{ flex: 1, fontSize: 14, color: "var(--text-primary)" }}>{q}</span>
                  <CloseOutlined
                    style={{ fontSize: 11, color: "var(--text-secondary)", padding: 4 }}
                    onClick={(e) => handleRemoveRecent(e, q)}
                  />
                </div>
              ))}
            </>
          )}

          {/* Suggest Results */}
          {showResults && !loading && hasResults && (
            <>
              {Object.entries(results).map(([group, items]) => {
                if (!items.length) return null;
                return (
                  <div key={group}>
                    <div className="search-dropdown-category">{TYPE_LABELS[group] || group}</div>
                    {items.map((item, i) => {
                      const globalIdx = flatItems.findIndex((f) => f.id === item.id && f.group === group);
                      return (
                        <div
                          key={`${group}-${item.id}`}
                          className={`search-dropdown-item ${globalIdx === activeIndex ? "active" : ""}`}
                          onClick={() => navigate(item.url)}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                        >
                          {item.type === "user" ? (
                            <Avatar src={getDefaultAvatar(item.url?.replace("/user/", ""))} size={24} />
                          ) : item.type === "tag" ? (
                            <Tag color="#e5873a" style={{ borderRadius: 8, margin: 0, fontSize: 12 }}>#</Tag>
                          ) : (
                            TYPE_ICONS[item.type]
                          )}
                          <span style={{ flex: 1, fontSize: 13, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.label}
                          </span>
                          <RightOutlined style={{ fontSize: 10, color: "var(--text-secondary)", opacity: 0.4 }} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {/* See all results */}
              <div
                className="search-dropdown-item"
                onClick={goToSearch}
                style={{ borderTop: "1px solid var(--border-color)", justifyContent: "center" }}
              >
                <SearchOutlined style={{ color: "#2563eb" }} />
                <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
                  See all results for &ldquo;{query}&rdquo;
                </span>
              </div>
            </>
          )}

          {/* No results */}
          {showResults && !loading && !hasResults && (
            <div style={{ padding: "24px 16px", textAlign: "center" }}>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>
                No results for &ldquo;{query}&rdquo;
              </div>
              <div
                style={{ fontSize: 12, color: "#e5873a", cursor: "pointer" }}
                onClick={goToSearch}
              >
                Press Enter for AI-powered search
              </div>
            </div>
          )}

          {/* Loading */}
          {showResults && loading && (
            <div style={{ padding: "24px 16px", textAlign: "center" }}>
              <Spin size="small" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
