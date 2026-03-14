import { authors } from "./authors";

export const comments = [
  { id: "c1", postId: "1", author: authors[2], content: "Great introduction to Next.js 15! The server components section was especially helpful. Looking forward to trying these patterns in my own projects.", createdAt: "2026-03-13T14:30:00Z", likes: 12 },
  { id: "c2", postId: "1", author: authors[4], content: "The performance improvements are impressive. I migrated a project last week and saw a 40% reduction in bundle size.", createdAt: "2026-03-13T16:00:00Z", likes: 8 },
  { id: "c3", postId: "1", author: authors[1], content: "How does this compare with Remix? Would love to see a comparison article.", createdAt: "2026-03-13T18:45:00Z", likes: 5 },
  { id: "c4", postId: "2", author: authors[0], content: "The CSS-first config is a game changer. No more fighting with JavaScript config files!", createdAt: "2026-03-12T17:00:00Z", likes: 15 },
  { id: "c5", postId: "2", author: authors[3], content: "Been using Tailwind v4 for a month now. The speed improvements are noticeable even on large projects.", createdAt: "2026-03-12T19:30:00Z", likes: 9 },
  { id: "c6", postId: "3", author: authors[0], content: "This is exactly what I needed! Building an AI-powered code review tool with these patterns.", createdAt: "2026-03-11T12:00:00Z", likes: 22 },
  { id: "c7", postId: "3", author: authors[5], content: "Security tip: always validate and sanitize AI outputs before rendering them in the DOM.", createdAt: "2026-03-11T14:20:00Z", likes: 18 },
  { id: "c8", postId: "5", author: authors[2], content: "The mental model section really clicked for me. Server Components finally make sense!", createdAt: "2026-03-09T15:00:00Z", likes: 11 },
  { id: "c9", postId: "6", author: authors[1], content: "Tip #7 about partial indexes saved us 60% storage on our production database.", createdAt: "2026-03-08T12:30:00Z", likes: 14 },
  { id: "c10", postId: "7", author: authors[0], content: "The :has() selector examples blew my mind. CSS has come so far!", createdAt: "2026-03-07T16:00:00Z", likes: 7 },
  { id: "c11", postId: "10", author: authors[3], content: "Git bisect has saved me countless hours. Should be in every developer's toolkit.", createdAt: "2026-03-04T13:00:00Z", likes: 10 },
  { id: "c12", postId: "9", author: authors[0], content: "We switched from React Native to Flutter last year. Performance is great but we miss the npm ecosystem.", createdAt: "2026-03-05T18:00:00Z", likes: 6 },
];
