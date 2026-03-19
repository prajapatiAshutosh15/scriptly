// Centralized mock data for all sections
// Enable via NEXT_PUBLIC_MOCK_DATA=true in .env.local

export const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_DATA === "true";

export const MOCK_USERS = [
  { id: "u1", name: "Sarah Chen", username: "sarahchen", avatar: null, reputation: 12450, bio: "Full-stack dev. React, TypeScript, Node.js", answers_count: 234, questions_count: 45 },
  { id: "u2", name: "Marcus Johnson", username: "marcusj", avatar: null, reputation: 9870, bio: "AI/ML Engineer. Python & Rust", answers_count: 189, questions_count: 32 },
  { id: "u3", name: "Priya Sharma", username: "priyasharma", avatar: null, reputation: 8340, bio: "TypeScript enthusiast. Building dev tools.", answers_count: 156, questions_count: 28 },
  { id: "u4", name: "Alex Rivera", username: "alexrivera", avatar: null, reputation: 7120, bio: "Backend engineer. Rust & Go.", answers_count: 143, questions_count: 51 },
  { id: "u5", name: "David Chen", username: "davidc", avatar: null, reputation: 6890, bio: "React core team contributor", answers_count: 128, questions_count: 19 },
  { id: "u6", name: "Emma Wilson", username: "emmaw", avatar: null, reputation: 5670, bio: "Database performance expert", answers_count: 112, questions_count: 37 },
  { id: "u7", name: "Jordan Kim", username: "jordankim", avatar: null, reputation: 4980, bio: "DevOps & Cloud Architecture", answers_count: 98, questions_count: 22 },
  { id: "u8", name: "Lena Park", username: "lenapark", avatar: null, reputation: 4230, bio: "Open source maintainer", answers_count: 87, questions_count: 41 },
  { id: "u9", name: "Carlos Mendez", username: "carlosm", avatar: null, reputation: 3890, bio: "Full-stack. Laravel & Vue.", answers_count: 76, questions_count: 15 },
  { id: "u10", name: "Yuki Tanaka", username: "yukit", avatar: null, reputation: 3450, bio: "Mobile dev. Flutter & Swift", answers_count: 64, questions_count: 33 },
  { id: "u11", name: "Nadia Ali", username: "nadiaali", avatar: null, reputation: 2980, bio: "Security researcher", answers_count: 52, questions_count: 27 },
  { id: "u12", name: "Rahul Patel", username: "rahulp", avatar: null, reputation: 2540, bio: "Node.js & GraphQL", answers_count: 48, questions_count: 18 },
];

export const MOCK_TAGS = [
  { id: 1, name: "JavaScript", slug: "javascript", color: "#f7df1e", description: "Programming in ECMAScript and its dialects", post_count: 245, question_count: 89 },
  { id: 2, name: "React", slug: "react", color: "#61dafb", description: "A library for building user interfaces", post_count: 198, question_count: 120 },
  { id: 3, name: "Python", slug: "python", color: "#3776ab", description: "General-purpose programming language", post_count: 167, question_count: 95 },
  { id: 4, name: "TypeScript", slug: "typescript", color: "#3178c6", description: "Typed superset of JavaScript", post_count: 156, question_count: 78 },
  { id: 5, name: "Node.js", slug: "nodejs", color: "#68a063", description: "JavaScript runtime for server-side", post_count: 134, question_count: 67 },
  { id: 6, name: "Next.js", slug: "nextjs", color: "#000000", description: "The React framework for production", post_count: 112, question_count: 54 },
  { id: 7, name: "Docker", slug: "docker", color: "#2496ed", description: "Container platform", post_count: 98, question_count: 43 },
  { id: 8, name: "AI", slug: "ai", color: "#ff6f61", description: "Artificial intelligence & ML", post_count: 187, question_count: 62 },
  { id: 9, name: "DevOps", slug: "devops", color: "#326ce5", description: "Development & operations practices", post_count: 76, question_count: 38 },
  { id: 10, name: "PostgreSQL", slug: "postgresql", color: "#4169e1", description: "Open-source relational database", post_count: 89, question_count: 51 },
  { id: 11, name: "CSS", slug: "css", color: "#264de4", description: "Styling web pages", post_count: 123, question_count: 45 },
  { id: 12, name: "Rust", slug: "rust", color: "#dea584", description: "Systems programming language", post_count: 67, question_count: 34 },
  { id: 13, name: "Go", slug: "go", color: "#00add8", description: "Programming language by Google", post_count: 78, question_count: 41 },
  { id: 14, name: "GraphQL", slug: "graphql", color: "#e10098", description: "Query language for APIs", post_count: 54, question_count: 29 },
  { id: 15, name: "AWS", slug: "aws", color: "#ff9900", description: "Amazon Web Services", post_count: 92, question_count: 48 },
];

export const MOCK_POSTS = [
  { id: "p1", slug: "getting-started-with-nextjs-15", title: "Getting Started with Next.js 15: A Complete Guide", excerpt: "Learn how to build modern web apps with Next.js 15, including the new app router, server components, and streaming.", coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop", readTime: 8, likes: 142, comments: 24, views: 3200, publishedAt: "2026-03-17T10:00:00Z", isLiked: false, isBookmarked: false, author: { id: "u1", name: "Sarah Chen", username: "sarahchen", avatar: null, reputation: 12450 }, tags: [{ id: 6, name: "Next.js", slug: "nextjs" }, { id: 2, name: "React", slug: "react" }] },
  { id: "p2", slug: "rust-for-web-developers", title: "Why Rust is the Future of Web Development", excerpt: "Explore how Rust is transforming backend development with blazing-fast performance and memory safety guarantees.", coverImage: "https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=800&h=400&fit=crop", readTime: 12, likes: 89, comments: 31, views: 2100, publishedAt: "2026-03-16T14:30:00Z", isLiked: false, isBookmarked: false, author: { id: "u4", name: "Alex Rivera", username: "alexrivera", avatar: null, reputation: 7120 }, tags: [{ id: 12, name: "Rust", slug: "rust" }] },
  { id: "p3", slug: "mastering-typescript-generics", title: "Mastering TypeScript Generics: From Basics to Advanced Patterns", excerpt: "A deep dive into TypeScript generics with practical examples, utility types, and real-world patterns you can use today.", coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop", readTime: 15, likes: 215, comments: 42, views: 5800, publishedAt: "2026-03-15T08:00:00Z", isLiked: false, isBookmarked: false, author: { id: "u3", name: "Priya Sharma", username: "priyasharma", avatar: null, reputation: 8340 }, tags: [{ id: 4, name: "TypeScript", slug: "typescript" }, { id: 1, name: "JavaScript", slug: "javascript" }] },
  { id: "p4", slug: "docker-kubernetes-production", title: "Docker & Kubernetes: Production-Ready Deployment Guide", excerpt: "Step-by-step guide to containerizing your applications and deploying them to Kubernetes clusters in production.", coverImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop", readTime: 20, likes: 178, comments: 56, views: 4200, publishedAt: "2026-03-14T12:00:00Z", isLiked: false, isBookmarked: false, author: { id: "u7", name: "Jordan Kim", username: "jordankim", avatar: null, reputation: 4980 }, tags: [{ id: 7, name: "Docker", slug: "docker" }, { id: 9, name: "DevOps", slug: "devops" }] },
  { id: "p5", slug: "building-ai-agents-2026", title: "Building AI Agents in 2026: Tools, Frameworks & Best Practices", excerpt: "An overview of the latest AI agent frameworks, how to choose the right one, and practical tips for building reliable agents.", coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop", readTime: 10, likes: 324, comments: 67, views: 8900, publishedAt: "2026-03-13T09:00:00Z", isLiked: false, isBookmarked: false, author: { id: "u2", name: "Marcus Johnson", username: "marcusj", avatar: null, reputation: 9870 }, tags: [{ id: 8, name: "AI", slug: "ai" }, { id: 3, name: "Python", slug: "python" }] },
  { id: "p6", slug: "postgresql-performance-tuning", title: "PostgreSQL Performance Tuning: 10 Tips That Actually Work", excerpt: "Practical PostgreSQL optimization techniques including indexing strategies, query planning, and configuration tuning.", coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop", readTime: 14, likes: 156, comments: 29, views: 3600, publishedAt: "2026-03-12T16:00:00Z", isLiked: false, isBookmarked: false, author: { id: "u6", name: "Emma Wilson", username: "emmaw", avatar: null, reputation: 5670 }, tags: [{ id: 10, name: "PostgreSQL", slug: "postgresql" }] },
];

export const MOCK_QUESTIONS = [
  { id: "q1", slug: "how-to-handle-auth-nextjs-15", title: "How to handle authentication in Next.js 15 with App Router?", body: "I'm building a full-stack app with Next.js 15...", status: "open", is_answered: true, votes_count: 47, answers_count: 5, views_count: 1820, created_at: "2026-03-17T08:30:00Z", author_id: "u1", author_name: "Rahul Patel", author_username: "rahulp", author_avatar: null, author_reputation: 2540, tags: [{ id: 6, name: "Next.js", slug: "nextjs" }, { id: 1, name: "Auth", slug: "auth" }] },
  { id: "q2", slug: "rust-vs-go-backend-2026", title: "Rust vs Go for backend services in 2026 — which should I learn?", body: "I'm a JavaScript developer looking to pick up a systems language...", status: "open", is_answered: false, votes_count: 32, answers_count: 12, views_count: 4500, created_at: "2026-03-16T14:00:00Z", author_id: "u8", author_name: "Lena Park", author_username: "lenapark", author_avatar: null, author_reputation: 4230, tags: [{ id: 12, name: "Rust", slug: "rust" }, { id: 13, name: "Go", slug: "go" }] },
  { id: "q3", slug: "react-server-components-data-fetching", title: "Best practices for data fetching with React Server Components?", body: "What's the recommended pattern for fetching data...", status: "open", is_answered: true, votes_count: 65, answers_count: 8, views_count: 3200, created_at: "2026-03-15T11:00:00Z", author_id: "u5", author_name: "David Chen", author_username: "davidc", author_avatar: null, author_reputation: 6890, tags: [{ id: 2, name: "React", slug: "react" }] },
  { id: "q4", slug: "docker-compose-vs-kubernetes-small-teams", title: "Docker Compose vs Kubernetes for small teams?", body: "Our team of 4 is debating whether to adopt Kubernetes...", status: "open", is_answered: false, votes_count: 28, answers_count: 6, views_count: 1950, created_at: "2026-03-14T09:00:00Z", author_id: "u9", author_name: "Sophie Turner", author_username: "sophiet", author_avatar: null, author_reputation: 670, tags: [{ id: 7, name: "Docker", slug: "docker" }] },
  { id: "q5", slug: "typescript-zod-vs-joi-validation", title: "Zod vs Joi for runtime validation in TypeScript?", body: "We need to choose a validation library...", status: "open", is_answered: true, votes_count: 41, answers_count: 7, views_count: 2800, created_at: "2026-03-13T16:30:00Z", author_id: "u2", author_name: "Mike Santos", author_username: "mikes", author_avatar: null, author_reputation: 2100, tags: [{ id: 4, name: "TypeScript", slug: "typescript" }] },
  { id: "q6", slug: "postgresql-jsonb-vs-separate-tables", title: "PostgreSQL JSONB vs separate tables for flexible schemas?", body: "We have a multi-tenant SaaS...", status: "open", is_answered: false, votes_count: 19, answers_count: 3, views_count: 980, created_at: "2026-03-12T10:00:00Z", author_id: "u11", author_name: "Anna Kowalski", author_username: "annak", author_avatar: null, author_reputation: 2980, tags: [{ id: 10, name: "PostgreSQL", slug: "postgresql" }] },
];

export const MOCK_DISCUSSIONS = [
  { id: "d1", slug: "what-tech-stack-for-saas-2026", title: "What tech stack are you using for SaaS in 2026?", body: "", isPinned: true, isLocked: false, replies: 34, views: 2800, lastActivityAt: "2026-03-17T15:00:00Z", createdAt: "2026-03-10T08:00:00Z", categoryName: "General", categoryColor: "#e5873a", author: { id: "u1", name: "Ashutosh P.", username: "ashutosh", avatar: null } },
  { id: "d2", slug: "remote-work-tips-developers", title: "Tips for staying productive as a remote developer?", body: "", isPinned: false, isLocked: false, replies: 22, views: 1500, lastActivityAt: "2026-03-16T12:00:00Z", createdAt: "2026-03-12T10:00:00Z", categoryName: "General", categoryColor: "#e5873a", author: { id: "u2", name: "Emily Zhang", username: "emilyz", avatar: null } },
  { id: "d3", slug: "help-cors-error-express", title: "CORS errors when deploying Express + React to different domains", body: "", isPinned: false, isLocked: false, replies: 8, views: 640, lastActivityAt: "2026-03-15T18:00:00Z", createdAt: "2026-03-14T09:00:00Z", categoryName: "Help", categoryColor: "#22c55e", author: { id: "u3", name: "Carlos Mendez", username: "carlosm", avatar: null } },
  { id: "d4", slug: "show-my-open-source-cli-tool", title: "Show: I built a CLI tool that generates API docs from TypeScript", body: "", isPinned: false, isLocked: false, replies: 15, views: 1100, lastActivityAt: "2026-03-14T20:00:00Z", createdAt: "2026-03-13T14:00:00Z", categoryName: "Show & Tell", categoryColor: "#f59e0b", author: { id: "u4", name: "Yuki Tanaka", username: "yukit", avatar: null } },
  { id: "d5", slug: "idea-ai-code-review-bot", title: "Idea: AI-powered code review bot for GitHub PRs", body: "", isPinned: false, isLocked: false, replies: 19, views: 920, lastActivityAt: "2026-03-13T11:00:00Z", createdAt: "2026-03-11T16:00:00Z", categoryName: "Ideas", categoryColor: "#8b5cf6", author: { id: "u5", name: "Nadia Ali", username: "nadiaali", avatar: null } },
];

export const MOCK_CATEGORIES = [
  { id: 1, name: "General", slug: "general" },
  { id: 2, name: "Help", slug: "help" },
  { id: 3, name: "Show & Tell", slug: "show-tell" },
  { id: 4, name: "Ideas", slug: "ideas" },
];

// Detail page mock data — keyed by slug for quick lookup
export const MOCK_QUESTION_DETAILS = Object.fromEntries(MOCK_QUESTIONS.map(q => [q.slug, {
  ...q,
  body: `## Problem\n\nI've been working on this for a while and can't figure out the best approach. ${q.body}\n\n## What I've tried\n\n- Searched the docs but couldn't find a clear answer\n- Tried several approaches from blog posts but they're outdated\n- Asked in Discord but got conflicting advice\n\n## Expected behavior\n\nI'd like a clean, production-ready solution that follows best practices and is maintainable long-term.\n\n\`\`\`javascript\n// Here's my current approach\nconst config = {\n  auth: true,\n  provider: 'custom',\n  session: { strategy: 'jwt' }\n};\n\`\`\`\n\nAny help would be appreciated!`,
  answers: [
    { id: `${q.id}-a1`, body: "Great question! Here's what I recommend based on my experience in production:\n\n1. Use the built-in middleware approach\n2. Keep your auth logic server-side\n3. Use cookies for session tokens\n\n```javascript\n// middleware.js\nexport function middleware(request) {\n  const token = request.cookies.get('session');\n  if (!token) return NextResponse.redirect('/login');\n  return NextResponse.next();\n}\n```\n\nThis has worked well for us at scale.", is_accepted: true, votes_count: 23, comments_count: 3, created_at: "2026-03-17T10:00:00Z", author_id: "u1", author_name: "Sarah Chen", author_username: "sarahchen", author_avatar: null, author_reputation: 12450 },
    { id: `${q.id}-a2`, body: "I'd add to the above answer — don't forget about CSRF protection when using cookies. Also consider using `iron-session` for encrypted sessions.\n\nHere's a more complete example with error handling included.", is_accepted: false, votes_count: 12, comments_count: 1, created_at: "2026-03-17T12:00:00Z", author_id: "u5", author_name: "David Chen", author_username: "davidc", author_avatar: null, author_reputation: 6890 },
    { id: `${q.id}-a3`, body: "Another approach worth considering is using Auth.js (formerly NextAuth). It handles OAuth, JWT, and database sessions out of the box.\n\n```bash\nnpm install next-auth\n```\n\nThe documentation has improved significantly in v5.", is_accepted: false, votes_count: 8, comments_count: 0, created_at: "2026-03-17T15:00:00Z", author_id: "u3", author_name: "Priya Sharma", author_username: "priyasharma", author_avatar: null, author_reputation: 8340 },
  ],
}]));

export const MOCK_DISCUSSION_DETAILS = Object.fromEntries(MOCK_DISCUSSIONS.map(d => [d.slug, {
  ...d,
  body: `Hey everyone! 👋\n\nI wanted to start a discussion about this topic. ${d.title}\n\nI've been thinking about this a lot lately and would love to hear different perspectives from the community.\n\n**Some points to consider:**\n- What's worked for you?\n- What would you recommend to someone starting out?\n- Any tools or resources you'd suggest?\n\nLooking forward to hearing your thoughts!`,
  replies: [
    { id: `${d.id}-r1`, body: "This is such a great topic! For me, I've found that consistency is key. I use a Pomodoro timer and take regular breaks.\n\nAlso, having a dedicated workspace makes a huge difference.", author_name: "Sarah Chen", author_username: "sarahchen", author_avatar: null, created_at: "2026-03-17T10:00:00Z" },
    { id: `${d.id}-r2`, body: "I agree with @sarahchen. I'd also add that having clear boundaries between work and personal time is essential. I shut my laptop at 6pm every day.", author_name: "Marcus Johnson", author_username: "marcusj", author_avatar: null, created_at: "2026-03-17T12:00:00Z" },
    { id: `${d.id}-r3`, body: "Great discussion! One thing that helped me was joining a co-working community online. It gives you accountability without the commute.", author_name: "Priya Sharma", author_username: "priyasharma", author_avatar: null, created_at: "2026-03-17T14:00:00Z" },
    { id: `${d.id}-r4`, body: "I use time-blocking and batch similar tasks together. Checking emails/Slack only at specific times has been a game-changer for deep work.", author_name: "Jordan Kim", author_username: "jordankim", author_avatar: null, created_at: "2026-03-17T16:00:00Z" },
  ],
}]));

export const MOCK_POST_DETAILS = Object.fromEntries(MOCK_POSTS.map(p => [p.slug, {
  ...p,
  content: `# ${p.title}\n\n${p.excerpt}\n\n## Introduction\n\nIn this comprehensive guide, we'll explore everything you need to know about this topic. Whether you're a beginner or an experienced developer, there's something here for everyone.\n\n## Getting Started\n\nFirst, let's set up our development environment:\n\n\`\`\`bash\nnpm create next-app@latest my-project\ncd my-project\nnpm run dev\n\`\`\`\n\n## Key Concepts\n\nHere are the most important things to understand:\n\n1. **Architecture** — Understanding the underlying architecture is crucial\n2. **Best Practices** — Follow established patterns for maintainable code\n3. **Performance** — Always measure before and after optimization\n\n## Code Example\n\n\`\`\`typescript\ninterface Config {\n  theme: 'light' | 'dark';\n  language: string;\n  features: string[];\n}\n\nfunction createApp(config: Config) {\n  return {\n    ...config,\n    initialized: true,\n    timestamp: Date.now(),\n  };\n}\n\`\`\`\n\n## Conclusion\n\nThis is just the beginning. As you continue learning, you'll discover more advanced patterns and techniques. The key is to keep building and experimenting.\n\n> "The best way to learn is by doing." — Every developer ever\n\nHappy coding! 🚀`,
  comments: [
    { id: `${p.id}-c1`, body: "This is an excellent article! Very well written and covers all the important points.", author_name: "David Chen", author_username: "davidc", author_avatar: null, likes_count: 8, created_at: "2026-03-17T12:00:00Z" },
    { id: `${p.id}-c2`, body: "Thanks for sharing. The code examples are really helpful. Would love to see a follow-up on advanced patterns.", author_name: "Lena Park", author_username: "lenapark", author_avatar: null, likes_count: 5, created_at: "2026-03-17T14:00:00Z" },
    { id: `${p.id}-c3`, body: "Great work! One small suggestion — you might want to mention the performance implications in the architecture section.", author_name: "Jordan Kim", author_username: "jordankim", author_avatar: null, likes_count: 3, created_at: "2026-03-17T16:00:00Z" },
  ],
}]));

export const MOCK_TRENDING = MOCK_POSTS.slice(0, 5).map(p => ({
  id: p.id, slug: p.slug, title: p.title, likes: p.likes,
  author: p.author,
}));

export const MOCK_FEATURED = MOCK_POSTS.slice(0, 3).map(p => ({
  id: p.id, slug: p.slug, title: p.title,
  author: { name: p.author.name, avatar: null },
}));
