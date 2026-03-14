"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchInput({ compact = false }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className={`
          pl-9 pr-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700
          rounded-full text-sm text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
          transition-all
          ${compact ? "py-1.5 w-48 focus:w-64" : "py-2.5 w-full"}
        `}
      />
    </form>
  );
}
