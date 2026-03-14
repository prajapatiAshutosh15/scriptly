import { authors } from "./authors";

export const posts = [
  {
    id: "1",
    slug: "getting-started-with-nextjs-15",
    title: "Getting Started with Next.js 15: Everything You Need to Know",
    excerpt: "Next.js 15 brings exciting new features including the App Router improvements, Server Components, and enhanced performance. Let's dive deep into what's new.",
    coverImage: "https://picsum.photos/seed/nextjs15/800/400",
    author: authors[0],
    publishedAt: "2026-03-13T10:00:00Z",
    readTime: 8,
    likes: 342,
    comments: 47,
    views: 12500,
    tags: ["Next.js", "React", "Web Dev"],
    featured: true,
    content: `
<h2>Introduction to Next.js 15</h2>
<p>Next.js 15 represents a major leap forward in the React ecosystem. With improvements to the App Router, enhanced Server Components, and blazing-fast performance optimizations, it's never been a better time to start building with Next.js.</p>

<h2>Key Features</h2>
<p>The latest release brings several groundbreaking features that change how we build modern web applications. From improved data fetching patterns to better developer experience, every aspect has been carefully refined.</p>

<h3>Server Components by Default</h3>
<p>Components are now server-rendered by default, reducing the JavaScript bundle sent to the client. This means faster page loads, better SEO, and improved user experience across all devices.</p>

<blockquote>Server Components allow you to write UI that can be rendered and optionally cached on the server. The result is smaller client bundles and improved performance.</blockquote>

<h3>Improved Routing</h3>
<p>The App Router now supports more flexible routing patterns, including parallel routes, intercepting routes, and improved loading states. These features make it easier to build complex application layouts.</p>

<pre><code>// app/dashboard/layout.js
export default function DashboardLayout({ children, analytics, team }) {
  return (
    &lt;div&gt;
      {children}
      {analytics}
      {team}
    &lt;/div&gt;
  );
}</code></pre>

<h2>Performance Improvements</h2>
<p>Next.js 15 includes significant performance improvements including faster builds, optimized image loading, and reduced memory usage during development. The development server now starts up to 50% faster.</p>

<h2>Getting Started</h2>
<p>To create a new Next.js 15 project, simply run the following command and follow the prompts to set up your application with all the latest features enabled by default.</p>

<h2>Conclusion</h2>
<p>Next.js 15 is a fantastic release that solidifies its position as the leading React framework. Whether you're building a simple blog or a complex enterprise application, Next.js 15 has the tools you need to succeed.</p>
`,
  },
  {
    id: "2",
    slug: "mastering-tailwind-css-4",
    title: "Mastering Tailwind CSS v4: A Complete Guide to the New CSS-First Configuration",
    excerpt: "Tailwind CSS v4 introduces a revolutionary CSS-first configuration approach. Learn how to leverage the new @theme directive and build stunning UIs faster than ever.",
    coverImage: "https://picsum.photos/seed/tailwind4/800/400",
    author: authors[2],
    publishedAt: "2026-03-12T14:30:00Z",
    readTime: 12,
    likes: 528,
    comments: 63,
    views: 18200,
    tags: ["CSS", "Tailwind", "Web Dev"],
    featured: true,
    content: `
<h2>The Evolution of Tailwind CSS</h2>
<p>Tailwind CSS v4 marks a fundamental shift in how we configure our design systems. Gone are the days of JavaScript configuration files — everything now lives in your CSS, making it more intuitive and powerful.</p>

<h2>CSS-First Configuration</h2>
<p>The new @theme directive replaces tailwind.config.js entirely. Define your design tokens directly in CSS where they belong, and enjoy better IDE support and faster compilation.</p>

<pre><code>@import "tailwindcss";

@theme {
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
  --font-sans: 'Inter', sans-serif;
}</code></pre>

<h2>Performance Gains</h2>
<p>The new engine is built on Rust and delivers compilation speeds up to 10x faster than v3. Hot module replacement is nearly instantaneous, making the development experience incredibly smooth.</p>

<h2>New Features</h2>
<p>Container queries, 3D transforms, and improved dark mode support are just a few of the exciting additions. The utility class library has been expanded while maintaining the framework's signature simplicity.</p>

<h2>Conclusion</h2>
<p>Tailwind CSS v4 is not just an update — it's a reimagining of how utility-first CSS should work. Upgrade your projects today and experience the difference.</p>
`,
  },
  {
    id: "3",
    slug: "building-ai-powered-apps-with-react",
    title: "Building AI-Powered Applications with React and OpenAI",
    excerpt: "Learn how to integrate AI capabilities into your React applications using the OpenAI API. From chatbots to content generation, unlock the power of AI in your frontend.",
    coverImage: "https://picsum.photos/seed/aireact/800/400",
    author: authors[4],
    publishedAt: "2026-03-11T09:15:00Z",
    readTime: 15,
    likes: 891,
    comments: 124,
    views: 32400,
    tags: ["AI", "React", "JavaScript"],
    featured: true,
    content: `
<h2>AI Meets Frontend Development</h2>
<p>Artificial Intelligence is no longer confined to backend services and data pipelines. Modern frontend applications are increasingly leveraging AI to provide intelligent, personalized user experiences.</p>

<h2>Setting Up the Integration</h2>
<p>We'll use the OpenAI API to add smart features to our React application. The key is to create a secure API route that proxies requests from the frontend to OpenAI.</p>

<h3>Creating the API Route</h3>
<p>Never expose your API keys on the client side. Instead, create a server-side API route that handles the communication with OpenAI securely.</p>

<h2>Building a Smart Chat Interface</h2>
<p>With streaming responses and real-time updates, we can build a chat interface that feels natural and responsive. React's state management makes it perfect for handling the dynamic nature of AI conversations.</p>

<h2>Content Generation</h2>
<p>AI can help users generate blog posts, summaries, and more. We'll build a content assistant that helps writers overcome creative blocks and produce high-quality content faster.</p>

<h2>Best Practices</h2>
<p>When building AI-powered apps, always consider rate limiting, error handling, and cost management. These practices ensure your application remains reliable and affordable at scale.</p>
`,
  },
  {
    id: "4",
    slug: "docker-for-javascript-developers",
    title: "Docker for JavaScript Developers: From Zero to Production",
    excerpt: "A comprehensive guide to containerizing your JavaScript applications with Docker. Learn Dockerfiles, multi-stage builds, and deployment strategies.",
    coverImage: "https://picsum.photos/seed/dockerjs/800/400",
    author: authors[1],
    publishedAt: "2026-03-10T16:45:00Z",
    readTime: 10,
    likes: 267,
    comments: 38,
    views: 9800,
    tags: ["Docker", "DevOps", "Node.js"],
    featured: false,
    content: `
<h2>Why Docker?</h2>
<p>Docker eliminates the "it works on my machine" problem by providing consistent environments across development, staging, and production. For JavaScript developers, this means reliable deployments every time.</p>

<h2>Your First Dockerfile</h2>
<p>Creating a Dockerfile for a Node.js application is straightforward. We'll start with a basic setup and progressively optimize it for production use.</p>

<h2>Multi-Stage Builds</h2>
<p>Multi-stage builds allow you to keep your production images lean while having all the tools you need during the build process. This is especially important for Next.js applications.</p>

<h2>Docker Compose</h2>
<p>When your application needs a database, cache, or other services, Docker Compose lets you define your entire stack in a single file and spin it up with one command.</p>

<h2>Production Tips</h2>
<p>Learn about health checks, graceful shutdowns, and logging best practices that will make your containerized applications production-ready.</p>
`,
  },
  {
    id: "5",
    slug: "understanding-react-server-components",
    title: "Understanding React Server Components: A Deep Dive",
    excerpt: "React Server Components change how we think about building React apps. This deep dive explains the mental model, benefits, and practical patterns you need to know.",
    coverImage: "https://picsum.photos/seed/rsc/800/400",
    author: authors[0],
    publishedAt: "2026-03-09T11:00:00Z",
    readTime: 14,
    likes: 456,
    comments: 72,
    views: 21300,
    tags: ["React", "JavaScript", "Web Dev"],
    featured: false,
    content: `
<h2>The Server Component Revolution</h2>
<p>React Server Components represent the biggest shift in React's architecture since hooks. They fundamentally change where and how your components execute, opening up new possibilities for performance and developer experience.</p>

<h2>How They Work</h2>
<p>Server Components render on the server and send their output as a serialized format to the client. Unlike traditional server-side rendering, they never hydrate — they don't add any JavaScript to your client bundle.</p>

<h2>When to Use Server vs Client Components</h2>
<p>Use Server Components for data fetching, accessing backend resources, and rendering static content. Use Client Components for interactivity, browser APIs, and state management.</p>

<h2>Practical Patterns</h2>
<p>We'll explore composition patterns that let you mix Server and Client Components effectively, including the "children as props" pattern and the "server component wrapper" pattern.</p>

<h2>Performance Benefits</h2>
<p>By moving rendering to the server, you reduce bundle size, eliminate client-side data fetching waterfalls, and improve Time to First Contentful Paint significantly.</p>
`,
  },
  {
    id: "6",
    slug: "postgresql-performance-tuning",
    title: "PostgreSQL Performance Tuning: 10 Tips That Actually Work",
    excerpt: "Stop guessing and start optimizing. These battle-tested PostgreSQL performance tips will help you squeeze every last drop of performance from your database.",
    coverImage: "https://picsum.photos/seed/postgres/800/400",
    author: authors[3],
    publishedAt: "2026-03-08T08:30:00Z",
    readTime: 11,
    likes: 389,
    comments: 56,
    views: 14700,
    tags: ["Database", "DevOps"],
    featured: false,
    content: `
<h2>Why Performance Matters</h2>
<p>A slow database means a slow application. PostgreSQL is incredibly powerful out of the box, but with proper tuning, you can achieve dramatic performance improvements.</p>

<h2>Indexing Strategies</h2>
<p>The right indexes can make queries orders of magnitude faster. Learn about B-tree, GiST, GIN, and partial indexes, and when to use each one.</p>

<h2>Query Optimization</h2>
<p>Understanding EXPLAIN ANALYZE output is crucial for identifying bottlenecks. We'll walk through real-world examples and show you how to rewrite slow queries.</p>

<h2>Connection Pooling</h2>
<p>Connection pooling with PgBouncer or built-in pooling can dramatically reduce connection overhead and improve throughput under high concurrency.</p>

<h2>Configuration Tuning</h2>
<p>The default PostgreSQL configuration is conservative. Adjusting shared_buffers, work_mem, and other settings for your hardware can yield significant performance gains.</p>
`,
  },
  {
    id: "7",
    slug: "modern-css-techniques-2026",
    title: "Modern CSS Techniques Every Developer Should Know in 2026",
    excerpt: "CSS has evolved tremendously. From container queries to scroll-driven animations, these modern techniques will level up your styling game.",
    coverImage: "https://picsum.photos/seed/moderncss/800/400",
    author: authors[2],
    publishedAt: "2026-03-07T13:20:00Z",
    readTime: 9,
    likes: 612,
    comments: 84,
    views: 25600,
    tags: ["CSS", "Web Dev"],
    featured: false,
    content: `
<h2>CSS in 2026</h2>
<p>The CSS landscape has transformed dramatically. Features that once required JavaScript or preprocessors are now available natively in all major browsers.</p>

<h2>Container Queries</h2>
<p>Finally, we can style elements based on their container's size rather than the viewport. This is a game-changer for component-based architectures.</p>

<h2>Scroll-Driven Animations</h2>
<p>Create stunning scroll-based effects without JavaScript. The new animation-timeline property lets you tie animations to scroll progress.</p>

<h2>CSS Nesting</h2>
<p>Native CSS nesting eliminates the need for preprocessors in many cases. Write cleaner, more organized stylesheets with familiar nesting syntax.</p>

<h2>The :has() Selector</h2>
<p>Often called the "parent selector," :has() opens up entirely new styling possibilities that were previously impossible with CSS alone.</p>
`,
  },
  {
    id: "8",
    slug: "building-rest-apis-with-node",
    title: "Building Production-Ready REST APIs with Node.js and Express",
    excerpt: "A practical guide to building scalable REST APIs with Node.js. Covers authentication, validation, error handling, testing, and deployment best practices.",
    coverImage: "https://picsum.photos/seed/nodeapi/800/400",
    author: authors[3],
    publishedAt: "2026-03-06T10:00:00Z",
    readTime: 16,
    likes: 445,
    comments: 67,
    views: 19800,
    tags: ["Node.js", "JavaScript", "DevOps"],
    featured: false,
    content: `
<h2>Beyond Hello World</h2>
<p>Building a REST API that works in development is easy. Building one that's secure, scalable, and maintainable in production requires careful planning and proven patterns.</p>

<h2>Project Structure</h2>
<p>A well-organized project structure is the foundation of a maintainable API. We'll use a layered architecture with clear separation of concerns.</p>

<h2>Authentication & Authorization</h2>
<p>JWT-based authentication with refresh tokens, role-based access control, and secure password handling — everything you need to protect your API.</p>

<h2>Validation & Error Handling</h2>
<p>Input validation prevents bad data from entering your system. Consistent error responses make your API predictable and easy to debug.</p>

<h2>Testing</h2>
<p>Unit tests, integration tests, and end-to-end tests each serve different purposes. Learn when and how to write each type effectively.</p>
`,
  },
  {
    id: "9",
    slug: "react-native-vs-flutter-2026",
    title: "React Native vs Flutter in 2026: Which Should You Choose?",
    excerpt: "An honest comparison of React Native and Flutter for cross-platform mobile development. We look at performance, developer experience, ecosystem, and real-world use cases.",
    coverImage: "https://picsum.photos/seed/rnflutter/800/400",
    author: authors[5],
    publishedAt: "2026-03-05T15:00:00Z",
    readTime: 13,
    likes: 723,
    comments: 156,
    views: 28900,
    tags: ["React", "Web Dev"],
    featured: false,
    content: `
<h2>The Mobile Development Landscape</h2>
<p>Cross-platform development has matured significantly. Both React Native and Flutter are production-ready frameworks used by major companies worldwide.</p>

<h2>Performance Comparison</h2>
<p>Flutter's Dart compilation to native code gives it a slight edge in raw performance, but React Native's new architecture has closed the gap significantly.</p>

<h2>Developer Experience</h2>
<p>React Native benefits from the massive JavaScript ecosystem and React's component model. Flutter offers a rich widget library and excellent tooling out of the box.</p>

<h2>Ecosystem & Community</h2>
<p>Both frameworks have thriving communities, but their strengths differ. React Native excels in npm package availability, while Flutter leads in built-in widgets and design consistency.</p>

<h2>The Verdict</h2>
<p>The best choice depends on your team's expertise and project requirements. We'll help you make an informed decision based on your specific situation.</p>
`,
  },
  {
    id: "10",
    slug: "git-advanced-techniques",
    title: "Advanced Git Techniques That Will Make You a Better Developer",
    excerpt: "Go beyond git add and git commit. Learn interactive rebasing, bisect, worktrees, reflog, and other advanced techniques that pros use daily.",
    coverImage: "https://picsum.photos/seed/gitpro/800/400",
    author: authors[1],
    publishedAt: "2026-03-04T09:00:00Z",
    readTime: 10,
    likes: 534,
    comments: 89,
    views: 22100,
    tags: ["Git", "DevOps"],
    featured: false,
    content: `
<h2>Beyond the Basics</h2>
<p>Most developers use only a fraction of Git's capabilities. These advanced techniques will help you work more efficiently and handle complex situations with confidence.</p>

<h2>Interactive Rebasing</h2>
<p>Clean up your commit history before merging. Squash, reorder, and edit commits to create a clear narrative of your changes.</p>

<h2>Git Bisect</h2>
<p>Binary search through your commit history to find exactly when a bug was introduced. This powerful tool can save hours of manual debugging.</p>

<h2>Worktrees</h2>
<p>Work on multiple branches simultaneously without stashing or switching. Git worktrees let you check out different branches in separate directories.</p>

<h2>The Reflog</h2>
<p>Your safety net for recovering lost commits. The reflog tracks every change to your branch tips, even after destructive operations.</p>
`,
  },
  {
    id: "11",
    slug: "introduction-to-web-security",
    title: "Web Security Fundamentals: Protecting Your Applications",
    excerpt: "Security shouldn't be an afterthought. Learn about XSS, CSRF, SQL injection, and other common vulnerabilities, plus how to defend against them.",
    coverImage: "https://picsum.photos/seed/websec/800/400",
    author: authors[4],
    publishedAt: "2026-03-03T12:00:00Z",
    readTime: 12,
    likes: 398,
    comments: 45,
    views: 16500,
    tags: ["Security", "Web Dev", "JavaScript"],
    featured: false,
    content: `
<h2>Why Security Matters</h2>
<p>Every web application is a potential target. Understanding common attack vectors and implementing proper defenses is essential for every developer, not just security specialists.</p>

<h2>Cross-Site Scripting (XSS)</h2>
<p>XSS attacks inject malicious scripts into web pages. Learn about reflected, stored, and DOM-based XSS, and how to prevent each type.</p>

<h2>CSRF Protection</h2>
<p>Cross-Site Request Forgery tricks users into performing actions they didn't intend. Token-based protection and SameSite cookies are your main defenses.</p>

<h2>Content Security Policy</h2>
<p>CSP headers give you fine-grained control over what resources your page can load. A well-configured CSP significantly reduces your attack surface.</p>

<h2>Authentication Security</h2>
<p>Secure password storage, multi-factor authentication, and session management — the pillars of a secure authentication system.</p>
`,
  },
  {
    id: "12",
    slug: "python-for-data-engineering",
    title: "Python for Data Engineering: Building Robust Data Pipelines",
    excerpt: "Learn how to build production-grade data pipelines with Python. From ETL processes to real-time streaming, master the tools and patterns that data engineers rely on.",
    coverImage: "https://picsum.photos/seed/pydata/800/400",
    author: authors[4],
    publishedAt: "2026-03-02T08:00:00Z",
    readTime: 14,
    likes: 312,
    comments: 41,
    views: 11200,
    tags: ["Python", "Database", "DevOps"],
    featured: false,
    content: `
<h2>Data Engineering with Python</h2>
<p>Python's rich ecosystem makes it the go-to language for data engineering. From pandas for transformation to Apache Airflow for orchestration, the tools are mature and battle-tested.</p>

<h2>ETL Pipeline Design</h2>
<p>Extract, Transform, Load — the classic pattern gets a modern makeover with Python. We'll build a pipeline that's robust, testable, and easy to maintain.</p>

<h2>Real-Time Processing</h2>
<p>Batch processing isn't always enough. Learn how to build streaming pipelines with Apache Kafka and Python for real-time data processing.</p>

<h2>Data Quality</h2>
<p>Bad data in, bad results out. Implement data validation, monitoring, and alerting to ensure your pipelines produce reliable output.</p>

<h2>Orchestration</h2>
<p>Apache Airflow and Prefect make it easy to schedule, monitor, and manage complex pipeline workflows with Python.</p>
`,
  },
];
