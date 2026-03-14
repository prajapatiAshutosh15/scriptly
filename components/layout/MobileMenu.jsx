"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import SearchInput from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";

export default function MobileMenu({ open, onClose }) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-dark shadow-2xl p-6 flex flex-col gap-6">
        {/* Close */}
        <button onClick={onClose} className="self-end p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Search */}
        <SearchInput />

        {/* Links */}
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Link
            href="/write"
            onClick={onClose}
            className="w-full text-center px-4 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            Write a Post
          </Link>
          <button className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
