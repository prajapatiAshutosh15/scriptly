import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { getRelativeTime } from "@/lib/utils";

export default function ArticleMeta({ author, publishedAt, readTime, likes, comments }) {
  return (
    <div className="flex items-center gap-3">
      <Link href={`/user/${author.username}`}>
        <Avatar src={author.avatar} alt={author.name} size="sm" />
      </Link>
      <div className="flex flex-col">
        <Link href={`/user/${author.username}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary transition-colors">
          {author.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{getRelativeTime(publishedAt)}</span>
          <span>·</span>
          <span>{readTime} min read</span>
          {likes > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likes}
              </span>
            </>
          )}
          {comments > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {comments}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
