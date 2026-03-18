# Scriptly Frontend Architecture — Community Platform Extension

> Stack Overflow + Dev.to + AI Q&A layered on top of the existing blogging platform.
> This document is the single source of truth for every file to create, modify, component to build, hook to write, and pattern to follow.

---

## EXISTING CODEBASE PATTERNS (Must Follow Exactly)

### Tech Stack
- **Next.js 16** (App Router, `"use client"` for all interactive components)
- **React 19** with hooks (`useState`, `useCallback`, `useEffect`, `useRef`)
- **Ant Design 6** (Card, Button, Tag, Avatar, Space, Typography, Input, Modal, Dropdown, Segmented, Skeleton, Spin, Divider, Tooltip, Popconfirm, Drawer, Upload)
- **Zustand 5** with `persist` middleware for global state
- **Axios** with interceptors for API (auto-attaches JWT, unwraps `response.data`, handles 401)
- **TipTap 3** for rich text editing (StarterKit + CodeBlock + Placeholder + Link + Image)
- **Tailwind CSS 4** (imported via `@import "tailwindcss"` in globals.css, used sparingly — most styling is inline `style={{}}`)
- **next-themes** for dark/light mode (`attribute="class"`, `defaultTheme="system"`)
- **Embla Carousel** for hero slider
- **Turndown** for HTML-to-Markdown conversion

### Ant Design Theme Tokens (from AntdConfigProvider)
```js
token: {
  colorPrimary: "#2563eb",          // Blue-600
  borderRadius: 8,
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  colorBgContainer: isDark ? "#1e293b" : "#ffffff",
  colorBgElevated: isDark ? "#1e293b" : "#ffffff",
  colorBgLayout: isDark ? "#0f172a" : "#f8fafc",
  colorText: isDark ? "#f1f5f9" : "#0f172a",
  colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
  colorBorder: isDark ? "#334155" : "#e2e8f0",
  colorBorderSecondary: isDark ? "#1e293b" : "#f1f5f9",
}
components: {
  Card: { paddingLG: 20 },
  Button: { borderRadius: 20 },
  Tag: { borderRadiusSM: 12 },
}
```

### CSS Variable System (from globals.css)
```css
:root {
  --nav-bg: rgba(255,255,255,0.85);
  --toolbar-bg: rgba(255,255,255,0.9);
  --footer-bg: #f8fafc;
  --border-color: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
}
.dark {
  --nav-bg: rgba(15,23,42,0.85);
  --toolbar-bg: rgba(15,23,42,0.9);
  --footer-bg: #1e293b;
  --border-color: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}
```

### Color Palette
| Purpose | Light | Dark |
|---------|-------|------|
| Primary/Links | `#2563eb` | `#2563eb` |
| Primary Highlight BG | `rgba(37,99,235,0.1)` | `rgba(37,99,235,0.1)` |
| Text Primary | `#0f172a` | `#f1f5f9` |
| Text Secondary | `#64748b` | `#94a3b8` |
| Body BG | `#ffffff` | `#0f172a` |
| Card/Container BG | `#ffffff` | `#1e293b` |
| Footer BG | `#f8fafc` | `#1e293b` |
| Border | `#e2e8f0` | `#334155` |
| Danger/Like Red | `#ef4444` | `#ef4444` |
| Code Block BG | `#1e293b` | `#1e293b` |
| Success Green | `#22c55e` | `#22c55e` |
| Warning Orange | `#f59e0b` | `#f59e0b` |
| Gradient Hero BG | `linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.05))` | same |

### Styling Patterns
1. **Inline styles for everything** — components use `style={{}}` objects, NOT Tailwind classes for layout
2. **Tailwind only for utility** — `@import "tailwindcss"` is available but only used in globals.css responsive rules
3. **CSS classes for responsive** — `.home-grid`, `.sidebar-desktop`, `.mobile-only`, `.hidden-mobile`, etc. toggled via media queries
4. **Card style**: `borderRadius: 16`, `overflow: "hidden"` on the Card
5. **Button style**: Always `shape="round"`, primary buttons get `type="primary"`
6. **Tag style**: `borderRadius: 12`, often `color="blue"`
7. **Page layout**: `maxWidth: 1280, margin: "0 auto", padding: "40px 24px"` (class `page-wrapper`)
8. **Grid layout**: `display: "grid"`, `gridTemplateColumns`, `gap` as inline styles
9. **Sticky elements**: `position: "sticky", top: 80` for sidebars
10. **Backdrop blur**: `backdropFilter: "blur(12px)"` for nav and toolbar
11. **Avatar default**: `background: "#2563eb"`, shows first letter of name
12. **Transitions**: `transition: "all 0.2s"` for hover states
13. **Font sizes**: 12px (meta), 13px (secondary text), 14px (body), 15-16px (titles), 18-20px (section heads), 32-48px (hero)

### Component Patterns
1. Every component starts with `"use client";`
2. Zustand subscriptions are **selective**: `useAuthStore((s) => s.isAuthenticated)` — never destructure entire store
3. API calls use `api.get/post/patch/delete` (axios instance from `@/services/api`)
4. Response format: `{ success: bool, data: {...}, message: str }` — response interceptor unwraps to `response.data`, so hooks receive `{ success, data, message }`
5. Normalizer functions in `lib/normalizers.js` transform snake_case API data to camelCase
6. Loading states use Ant `<Skeleton>` or `<Spin>`, never custom spinners
7. Empty states are simple centered `<div>` with secondary text
8. Error handling: `catch (err) { message.error(err?.error?.message || "Failed") }`
9. Auth gates: `if (!isAuthenticated) { router.push("/signin"); return; }`
10. **Lazy loading**: heavy components use `lazy(() => import(...))` with `<Suspense>`

### Hook Patterns
```js
// Standard hook shape (from usePosts, useComments, etc.)
export function useXxx() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchXxx = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/xxx', { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchXxx };
}
```

### Responsive Breakpoints (from globals.css)
| Breakpoint | Target |
|------------|--------|
| `max-width: 1024px` | Tablet: collapse sidebar, single-column grid |
| `max-width: 768px` | Mobile: hide desktop nav/search, show hamburger, stack layouts |
| `max-width: 480px` | Small phone: reduce hero, single-column footer, smaller cards |

---

## 1. COMPLETE FOLDER STRUCTURE

### New Files to CREATE

```
frontend/
├── app/
│   ├── page.jsx                              # MODIFY — add content tabs
│   ├── search/
│   │   └── page.jsx                          # MODIFY — unified search across content types
│   ├── questions/
│   │   ├── page.jsx                          # NEW — questions list page
│   │   ├── ask/
│   │   │   └── page.jsx                      # NEW — ask question form
│   │   └── [slug]/
│   │       └── page.jsx                      # NEW — question detail page
│   ├── discussions/
│   │   ├── page.jsx                          # NEW — discussions list page
│   │   ├── new/
│   │   │   └── page.jsx                      # NEW — create discussion
│   │   └── [slug]/
│   │       └── page.jsx                      # NEW — discussion detail page
│   ├── ai-assistant/
│   │   └── page.jsx                          # NEW — RAG chat interface
│   ├── tags/
│   │   ├── page.jsx                          # NEW — browse all tags
│   │   └── [slug]/
│   │       └── page.jsx                      # NEW — tag detail page
│   ├── leaderboard/
│   │   └── page.jsx                          # NEW — reputation leaderboard
│   ├── settings/
│   │   └── page.jsx                          # NEW — user settings
│   └── user/
│       └── [username]/
│           └── page.jsx                      # MODIFY — enhanced with tabs
│
├── components/
│   ├── questions/
│   │   ├── QuestionCard.jsx                  # NEW
│   │   ├── QuestionList.jsx                  # NEW
│   │   ├── QuestionDetail.jsx                # NEW
│   │   ├── AnswerCard.jsx                    # NEW
│   │   ├── AnswerForm.jsx                    # NEW
│   │   ├── AnswerList.jsx                    # NEW
│   │   ├── VoteButtons.jsx                   # NEW
│   │   └── AcceptAnswerButton.jsx            # NEW
│   │
│   ├── discussions/
│   │   ├── DiscussionCard.jsx                # NEW
│   │   ├── DiscussionList.jsx                # NEW
│   │   ├── DiscussionDetail.jsx              # NEW
│   │   ├── ReplyCard.jsx                     # NEW
│   │   ├── ReplyForm.jsx                     # NEW
│   │   └── CategoryBadge.jsx                 # NEW
│   │
│   ├── ai/
│   │   ├── ChatInterface.jsx                 # NEW
│   │   ├── ChatMessage.jsx                   # NEW
│   │   ├── ChatInput.jsx                     # NEW
│   │   ├── SourceCard.jsx                    # NEW
│   │   └── ConversationSidebar.jsx           # NEW
│   │
│   ├── shared/
│   │   ├── VoteWidget.jsx                    # NEW — generic vote component
│   │   ├── ReputationBadge.jsx               # NEW
│   │   ├── ContentTabs.jsx                   # NEW
│   │   ├── TagBadge.jsx                      # NEW — enhanced tag chip
│   │   ├── EmptyState.jsx                    # NEW
│   │   ├── InfiniteScrollWrapper.jsx         # NEW
│   │   ├── UserMiniCard.jsx                  # NEW — compact user display
│   │   └── ContentEditor.jsx                 # NEW — shared TipTap wrapper for Q&A + discussions
│   │
│   ├── layout/
│   │   ├── Navbar.jsx                        # MODIFY — add Q&A, Discussions, AI links
│   │   └── NotificationBell.jsx              # NEW
│   │
│   ├── home/
│   │   ├── Hero.jsx                          # MODIFY — update stats, CTAs
│   │   ├── ArticleFeed.jsx                   # MODIFY — rename to PostFeed or keep, used in tab
│   │   ├── QuestionFeed.jsx                  # NEW — recent questions for home
│   │   └── DiscussionFeed.jsx                # NEW — recent discussions for home
│   │
│   ├── profile/
│   │   ├── ProfilePageContent.jsx            # MODIFY — add tabs
│   │   ├── ProfileQuestions.jsx              # NEW — user's questions tab
│   │   ├── ProfileAnswers.jsx               # NEW — user's answers tab
│   │   └── ProfileBadges.jsx                # NEW — user's badges tab
│   │
│   ├── tags/
│   │   ├── TagGrid.jsx                       # NEW
│   │   └── TagDetailContent.jsx              # NEW
│   │
│   ├── leaderboard/
│   │   └── LeaderboardTable.jsx              # NEW
│   │
│   ├── settings/
│   │   ├── SettingsLayout.jsx                # NEW
│   │   ├── ProfileSettings.jsx               # NEW
│   │   ├── NotificationSettings.jsx          # NEW
│   │   └── AccountSettings.jsx               # NEW
│   │
│   └── search/
│       └── UnifiedSearchResults.jsx          # NEW
│
├── hooks/
│   ├── useQuestions.js                       # NEW
│   ├── useAnswers.js                         # NEW
│   ├── useVotes.js                           # NEW
│   ├── useDiscussions.js                     # NEW
│   ├── useSearch.js                          # NEW (or MODIFY if exists)
│   ├── useNotifications.js                   # NEW
│   └── useRag.js                             # NEW
│
├── stores/
│   ├── authStore.js                          # MODIFY — add reputation, badges
│   └── notificationStore.js                  # NEW
│
├── lib/
│   ├── endpoints.js                          # MODIFY — add all new routes
│   ├── constants.js                          # MODIFY — add nav links, categories
│   ├── normalizers.js                        # MODIFY — add question, answer, discussion normalizers
│   └── utils.js                              # MODIFY — add vote helpers, truncate, pluralize
│
├── services/
│   └── api.js                                # NO CHANGE
│
├── providers/
│   ├── AntdConfigProvider.jsx                # NO CHANGE
│   └── ThemeProvider.jsx                     # NO CHANGE
│
└── app/
    ├── globals.css                           # MODIFY — add responsive rules for new pages
    └── layout.jsx                            # NO CHANGE (Navbar changes handle nav updates)
```

### Summary Counts
- **New files**: 42
- **Modified files**: 10
- **Unchanged files**: 4

---

## 2. ALL NEW & MODIFIED PAGES

### 2.1 `/` — Enhanced Home Page
**File**: `app/page.jsx` (MODIFY)
**Route**: `/`
**Renders**: Hero carousel (updated stats/CTAs) + ContentTabs with 4 tabs: Feed | Posts | Questions | Discussions. Each tab renders its own feed component. Sidebar remains on desktop.
**Data**: Client-side fetching per tab. PostFeed fetches `/posts`, QuestionFeed fetches `/questions?sort=latest&limit=10`, DiscussionFeed fetches `/discussions?limit=10`.
**Layout**:
```
Hero (full width)
┌─────────────────────────────────┬──────────┐
│ ContentTabs                     │ Sidebar  │
│ [Feed] [Posts] [Questions] [Discussions]   │
│                                 │          │
│ <ActiveTabFeed />               │ Tags     │
│                                 │ Featured │
│                                 │ CTA      │
└─────────────────────────────────┴──────────┘
```

### 2.2 `/questions` — Questions List
**File**: `app/questions/page.jsx` (NEW)
**Route**: `/questions`
**Renders**: Page header ("Questions") + filter bar (Segmented: Latest / Votes / Unanswered / Active) + optional tag filter from query param + QuestionList + Sidebar with top tags + "Ask Question" CTA.
**Data**: `GET /questions?sort={sort}&tag={tag}&page={page}&limit=20`
**Layout**:
```
┌─────────────────────────────────┬──────────┐
│ "All Questions"     [Ask Question] button  │
│ Segmented: Latest|Votes|Unanswered|Active  │
│ ?tag=react → Tag filter badge              │
│                                 │ Top Tags │
│ QuestionCard                    │          │
│ QuestionCard                    │ Stats    │
│ QuestionCard                    │          │
│ [Load More]                     │          │
└─────────────────────────────────┴──────────┘
```

### 2.3 `/questions/ask` — Ask Question Form
**File**: `app/questions/ask/page.jsx` (NEW)
**Route**: `/questions/ask`
**Requires Auth**: Yes (redirect to `/signin` if not authenticated)
**Renders**: Same layout pattern as `/write` page. Title Input (borderless, font 32px, fontWeight 800) + ContentEditor (TipTap, same toolbar as RichTextEditor) + Tag selector (same as write page publish modal, but inline below editor) + Submit button.
**Data**: `POST /questions` with `{ title, body, tags: [...tagIds], custom_tags: [...names] }`
**Layout**:
```
┌──────────────────────────────────────────┐
│ Title input (borderless, 32px bold)       │
│                                           │
│ [TipTap Editor — same toolbar as /write]  │
│                                           │
│ Tags: [react] [node.js] [+ Add Tag]      │
│                                           │
│              [Cancel] [Post Question]     │
└──────────────────────────────────────────┘
```

### 2.4 `/questions/[slug]` — Question Detail
**File**: `app/questions/[slug]/page.jsx` (NEW)
**Route**: `/questions/:slug`
**Renders**: QuestionDetail (title, body, tags, author, time, vote buttons) + AnswerList (sorted by votes desc, accepted answer pinned top) + AnswerForm at bottom.
**Data**:
- `GET /questions/:slug` — question with body, author, votes, tags
- `GET /questions/:slug/answers` — all answers with votes, comments
**Layout**:
```
┌────┬────────────────────────────┬──────────┐
│Vote│ Question Title (h1, 28px)  │ Related  │
│ ▲  │ Tags: [react] [hooks]      │Questions │
│ 12 │ Author | Asked 2h ago      │          │
│ ▼  │                            │          │
│    │ Question body (prose)      │          │
│    │                            │          │
│    │ ─── 5 Answers ──────────── │          │
│    │                            │          │
│    │ ✓ Accepted Answer          │          │
│    │ Vote│ Answer body          │          │
│    │     │ Author | 1h ago      │          │
│    │     │ Comments (collapse)  │          │
│    │                            │          │
│    │ Vote│ Answer 2 body        │          │
│    │     │ Author | 3h ago      │          │
│    │                            │          │
│    │ ─── Your Answer ────────── │          │
│    │ [TipTap Editor]            │          │
│    │          [Post Answer]     │          │
└────┴────────────────────────────┴──────────┘
```

### 2.5 `/discussions` — Discussions List
**File**: `app/discussions/page.jsx` (NEW)
**Route**: `/discussions`
**Renders**: Page header + category tabs (Segmented: All | General | Help | Show & Tell | Ideas | Off-topic) + DiscussionList + "Start Discussion" CTA button.
**Data**: `GET /discussions?category={cat}&page={page}&limit=20`
**Layout**:
```
┌─────────────────────────────────────────────┐
│ "Discussions"             [Start Discussion] │
│ Segmented: All|General|Help|Show&Tell|Ideas  │
│                                              │
│ DiscussionCard                               │
│ DiscussionCard                               │
│ DiscussionCard                               │
│ [Load More]                                  │
└─────────────────────────────────────────────┘
```

### 2.6 `/discussions/new` — Create Discussion
**File**: `app/discussions/new/page.jsx` (NEW)
**Route**: `/discussions/new`
**Requires Auth**: Yes
**Renders**: Title input + Category select dropdown + ContentEditor (same TipTap) + Submit.
**Data**: `POST /discussions` with `{ title, body, category }`
**Layout**:
```
┌──────────────────────────────────────────┐
│ Title input (borderless, 32px bold)       │
│ Category: [Select v]                      │
│                                           │
│ [TipTap Editor]                           │
│                                           │
│              [Cancel] [Post Discussion]   │
└──────────────────────────────────────────┘
```

### 2.7 `/discussions/[slug]` — Discussion Detail
**File**: `app/discussions/[slug]/page.jsx` (NEW)
**Route**: `/discussions/:slug`
**Renders**: Discussion header (title, category badge, author, time) + body + threaded replies list + reply form.
**Data**:
- `GET /discussions/:slug` — discussion with body, author, category
- `GET /discussions/:slug/replies` — threaded replies
**Layout**:
```
┌──────────────────────────────────────────┐
│ [General] Discussion Title (h1, 28px)     │
│ Author | Started 2h ago | 15 replies      │
│                                           │
│ Discussion body (prose)                   │
│ [Like] [Share]                            │
│                                           │
│ ─── 15 Replies ───────────────────────── │
│                                           │
│ ┌ ReplyCard (avatar + name + time)       │
│ │ Reply body text                         │
│ │ [Like 3] [Reply]                       │
│ │   ┌ Nested ReplyCard                   │
│ │   │ Reply body text                     │
│ │   │ [Like 1]                           │
│ │   └                                    │
│ └                                        │
│                                           │
│ ─── Add Reply ───────────────────────── │
│ [TextArea]                                │
│                  [Post Reply]             │
└──────────────────────────────────────────┘
```

### 2.8 `/ai-assistant` — RAG Chat Interface
**File**: `app/ai-assistant/page.jsx` (NEW)
**Route**: `/ai-assistant`
**Requires Auth**: Yes
**Renders**: Two-panel layout. Left: ConversationSidebar (past conversations + "New Chat" button). Right: ChatInterface (message list with ChatMessage bubbles + ChatInput bar at bottom + SourceCard panel when sources are referenced).
**Data**:
- `GET /rag/conversations` — user's past conversations
- `GET /rag/conversations/:id` — single conversation history
- `POST /rag/ask` with `{ question, conversation_id? }` — ask question, get streamed response
**Layout**:
```
┌──────────┬───────────────────────────────┐
│ [+New]   │                               │
│          │  ChatMessage (assistant)       │
│ Conv 1   │  "Here's how React hooks..."  │
│ Conv 2   │  [SourceCard] [SourceCard]    │
│ Conv 3   │                               │
│          │  ChatMessage (user)            │
│          │  "How do I use useEffect?"     │
│          │                               │
│          │  ChatMessage (assistant)       │
│          │  "useEffect runs after..."     │
│          │                               │
│          ├───────────────────────────────┤
│          │ [Ask anything...] [Send ▶]    │
└──────────┴───────────────────────────────┘
```

### 2.9 `/tags` — Browse All Tags
**File**: `app/tags/page.jsx` (NEW)
**Route**: `/tags`
**Renders**: Page header + search input to filter tags + grid of TagCards (tag name, description, post count, question count).
**Data**: `GET /tags?include_counts=true`
**Layout**:
```
┌──────────────────────────────────────────┐
│ "Tags"                                    │
│ "Browse topics across the community"      │
│ [Search tags...]                          │
│                                           │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │react │ │node  │ │python│ │docker│     │
│ │desc  │ │desc  │ │desc  │ │desc  │     │
│ │120p  │ │89p   │ │67p   │ │45p   │     │
│ │34q   │ │21q   │ │15q   │ │8q    │     │
│ └──────┘ └──────┘ └──────┘ └──────┘     │
│ (grid: repeat(auto-fill, minmax(240px))) │
└──────────────────────────────────────────┘
```

### 2.10 `/tags/[slug]` — Tag Detail
**File**: `app/tags/[slug]/page.jsx` (NEW)
**Route**: `/tags/:slug`
**Renders**: Tag header (name, description, follow button, counts) + ContentTabs (Posts | Questions) showing filtered content for that tag.
**Data**:
- `GET /tags/:slug` — tag metadata
- `GET /tags/:slug/posts?page=1&limit=20` — posts with this tag
- `GET /tags/:slug/questions?page=1&limit=20` — questions with this tag
**Layout**:
```
┌──────────────────────────────────────────┐
│ #react                    [Follow Tag]    │
│ "A JavaScript library for building UIs"   │
│ 120 posts · 34 questions · 5.2K followers │
│                                           │
│ [Posts] [Questions]                       │
│                                           │
│ ArticleCard / QuestionCard list           │
│ [Load More]                               │
└──────────────────────────────────────────┘
```

### 2.11 `/user/[username]` — Enhanced Profile
**File**: `app/user/[username]/page.jsx` (MODIFY)
**Route**: `/user/:username`
**Renders**: Same profile header (avatar, name, bio, stats) but with additional stats (reputation, answers count) + ContentTabs: Posts | Questions | Answers | Badges.
**Data**:
- `GET /users/:username` — profile with reputation, badge_counts
- `GET /users/:username/posts` — user's posts
- `GET /users/:username/questions` — user's questions
- `GET /users/:username/answers` — user's answers
- `GET /users/:username/badges` — user's earned badges
**Layout**:
```
┌──────────────────────────────────────────┐
│ Profile Header (existing + reputation)    │
│ 45 Posts · 12 Questions · 28 Answers     │
│ · 1,240 Reputation · 8 Badges            │
│ [Follow]                                  │
│                                           │
│ [Posts] [Questions] [Answers] [Badges]   │
│                                           │
│ <ActiveTabContent />                      │
└──────────────────────────────────────────┘
```

### 2.12 `/leaderboard` — Reputation Leaderboard
**File**: `app/leaderboard/page.jsx` (NEW)
**Route**: `/leaderboard`
**Renders**: Page header + time filter (Segmented: Week | Month | Year | All Time) + LeaderboardTable (rank, avatar, name, reputation, answers count, badges).
**Data**: `GET /leaderboard?period={period}&page=1&limit=50`
**Layout**:
```
┌──────────────────────────────────────────┐
│ "Leaderboard"                             │
│ Segmented: Week | Month | Year | All Time │
│                                           │
│ # | User          | Rep  | Answers | Badges│
│ 1 | @johndoe      | 12.4K| 234     | 15    │
│ 2 | @janedoe      | 11.2K| 198     | 12    │
│ 3 | @devmaster    | 10.8K| 176     | 11    │
│ ...                                       │
│ [Load More]                               │
└──────────────────────────────────────────┘
```

### 2.13 `/settings` — User Settings
**File**: `app/settings/page.jsx` (NEW)
**Route**: `/settings`
**Requires Auth**: Yes
**Renders**: SettingsLayout with sidebar nav (Profile | Notifications | Account) + active settings panel.
**Data**: `GET /auth/me`, `PATCH /users/:username`, `PATCH /users/:username/notifications`
**Layout**:
```
┌──────────┬───────────────────────────────┐
│ Profile  │ Profile Settings              │
│ Notifs   │                               │
│ Account  │ Avatar upload                 │
│          │ Name: [...]                    │
│          │ Username: [...]                │
│          │ Bio: [...]                     │
│          │ Location: [...]                │
│          │ Website: [...]                 │
│          │ Twitter: [...]                 │
│          │ GitHub: [...]                  │
│          │         [Save Changes]         │
└──────────┴───────────────────────────────┘
```

### 2.14 `/search` — Enhanced Unified Search
**File**: `app/search/page.jsx` (MODIFY — currently exists for posts only)
**Route**: `/search?q={query}&type={posts|questions|discussions|users}`
**Renders**: Search input + type filter tabs (All | Posts | Questions | Discussions | Users) + UnifiedSearchResults showing mixed results grouped by type (in All mode) or filtered results (in specific type mode).
**Data**: `GET /search?q={query}&type={type}&page=1&limit=20`
**Layout**:
```
┌──────────────────────────────────────────┐
│ [Search input, pre-filled with ?q]       │
│ Segmented: All|Posts|Questions|Discussions|Users│
│                                           │
│ Results for "react hooks"                 │
│                                           │
│ Posts (24 results)                        │
│ ArticleCard, ArticleCard                  │
│                                           │
│ Questions (12 results)                    │
│ QuestionCard, QuestionCard                │
│                                           │
│ Discussions (3 results)                   │
│ DiscussionCard, DiscussionCard            │
│                                           │
│ Users (2 results)                         │
│ UserMiniCard, UserMiniCard                │
└──────────────────────────────────────────┘
```

---

## 3. ALL NEW COMPONENTS — Full Specifications

### 3.1 Questions Components

#### `components/questions/QuestionCard.jsx`
**Purpose**: Card showing a question in list views.
**Props**:
```js
{
  question: {
    id, slug, title, excerpt,     // string
    voteCount,                     // number (net votes)
    answerCount,                   // number
    viewCount,                     // number
    hasAcceptedAnswer,             // boolean
    tags: [{ id, name, slug, color }],
    author: { name, username, avatar },
    createdAt,                     // ISO string
  }
}
```
**Renders**: Horizontal layout card. Left: vote count + answer count (stacked vertically, answer count gets green bg if hasAcceptedAnswer). Right: title (link to `/questions/${slug}`), excerpt (1 line ellipsis), tags as TagBadge chips, author mini-info + relative time.
**Style Pattern**: Uses Ant `<Card>` with `borderRadius: 16`, `hoverable`. Left stats section uses `style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 80, padding: "16px 0" }}`. Title is `fontSize: 16, fontWeight: 600`. Answer count badge: `background: hasAcceptedAnswer ? "rgba(34,197,94,0.1)" : "transparent", color: hasAcceptedAnswer ? "#22c55e" : "var(--text-secondary)", border: hasAcceptedAnswer ? "1px solid #22c55e" : "1px solid var(--border-color)", borderRadius: 8, padding: "4px 10px"`.

#### `components/questions/QuestionList.jsx`
**Purpose**: Paginated list of QuestionCards with "Load More" button.
**Props**:
```js
{
  questions: [],          // array of question objects
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => void,
  emptyMessage?: string,  // default: "No questions found"
}
```
**Renders**: Vertical stack of QuestionCards with `gap: 16`. Loading state shows `<Skeleton>` cards. Empty state uses `<EmptyState>`. "Load More" button at bottom (same pattern as ArticleFeed).
**Style**: `display: "flex", flexDirection: "column", gap: 16`.

#### `components/questions/QuestionDetail.jsx`
**Purpose**: Full question display with body, voting, comments, and answer list.
**Props**:
```js
{
  question: {
    id, slug, title, body,       // body is markdown content
    voteCount, answerCount, viewCount,
    hasAcceptedAnswer,
    tags: [...],
    author: { id, name, username, avatar },
    createdAt, updatedAt,
    userVote: 1 | -1 | 0,        // current user's vote
  },
  answers: [],
  relatedQuestions: [],
}
```
**Renders**: Three-column grid (same as PostPageContent: `60px 1fr 220px`). Left column: VoteButtons (sticky). Center: title (h1, 28px, fontWeight 800), tags, author section with avatar + name + time (same style as PostPageContent), body rendered as prose (uses `<ArticleContent>` or a new MarkdownContent), then answer section below. Right column: related questions sidebar (sticky).
**Style**: Follows `PostPageContent.jsx` grid layout exactly. Uses `.post-grid` responsive class for collapse on mobile.

#### `components/questions/AnswerCard.jsx`
**Purpose**: Single answer display with voting, accept button, and inline comments.
**Props**:
```js
{
  answer: {
    id, body,                     // markdown content
    voteCount,
    isAccepted: boolean,
    author: { id, name, username, avatar },
    createdAt,
    userVote: 1 | -1 | 0,
    comments: [{ id, content, author, createdAt }],
  },
  isQuestionAuthor: boolean,      // show accept button if true
  onAccept: (answerId) => void,
}
```
**Renders**: Horizontal layout. Left: VoteButtons + AcceptAnswerButton (if isQuestionAuthor or isAccepted). Right: answer body (prose), author info footer, collapsible comments section, "Add Comment" link.
**Style**: Border-top `1px solid var(--border-color)`, padding `24px 0`. Accepted answers get a subtle green left border: `borderLeft: isAccepted ? "4px solid #22c55e" : "none"`.

#### `components/questions/AnswerForm.jsx`
**Purpose**: TipTap editor for writing/editing answers.
**Props**:
```js
{
  questionSlug: string,
  editingAnswer?: object,         // null for new, answer object for edit
  onSubmit: (answer) => void,
  onCancel?: () => void,
}
```
**Renders**: Section header "Your Answer", ContentEditor (shared TipTap wrapper), Submit button. Same pattern as write page: `<Suspense fallback={<Skeleton>}>` around lazy-loaded editor.
**Style**: `borderTop: "1px solid var(--border-color)"`, `paddingTop: 32`. Button: `type="primary" shape="round"`.

#### `components/questions/VoteButtons.jsx`
**Purpose**: Stack Overflow-style up/down vote arrows with count.
**Props**:
```js
{
  voteCount: number,
  userVote: 1 | -1 | 0,          // current user's vote state
  onVote: (value: 1 | -1) => void,
  size?: "default" | "small",    // small for answers
}
```
**Renders**: Vertical stack: up arrow button, vote count number, down arrow button. Active states: up arrow filled blue when userVote=1, down arrow filled when userVote=-1.
**Style**:
```js
// Container
{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }
// Arrow buttons
{
  cursor: "pointer", fontSize: size === "small" ? 18 : 24,
  color: isActive ? "#2563eb" : "var(--text-secondary)",
  transition: "all 0.2s",
  background: "none", border: "none", padding: 4,
}
// Count
{ fontSize: size === "small" ? 16 : 20, fontWeight: 700, color: "var(--text-primary)" }
```

#### `components/questions/AcceptAnswerButton.jsx`
**Purpose**: Checkmark button for question author to accept an answer.
**Props**:
```js
{
  isAccepted: boolean,
  isQuestionAuthor: boolean,
  onClick: () => void,
}
```
**Renders**: Checkmark icon. Green when accepted, gray when not. Only clickable when isQuestionAuthor.
**Style**: `color: isAccepted ? "#22c55e" : "var(--text-secondary)"`, `fontSize: 24`, `cursor: isQuestionAuthor ? "pointer" : "default"`.

---

### 3.2 Discussion Components

#### `components/discussions/DiscussionCard.jsx`
**Purpose**: Card showing a discussion in list views.
**Props**:
```js
{
  discussion: {
    id, slug, title, excerpt,
    category,                      // "general" | "help" | "show-and-tell" | "ideas" | "off-topic"
    replyCount: number,
    likeCount: number,
    author: { name, username, avatar },
    lastReplyAt,                   // ISO string
    createdAt,
  }
}
```
**Renders**: Card with CategoryBadge at top-left, title (link to `/discussions/${slug}`), excerpt (1 line), bottom row: author avatar + name, reply count icon, like count, relative time of last activity.
**Style**: Ant `<Card>` with `borderRadius: 16, hoverable`. Title: `fontSize: 16, fontWeight: 600`. Bottom row: `borderTop: "1px solid var(--border-color)"`, `paddingTop: 14`, flex row.

#### `components/discussions/DiscussionList.jsx`
**Purpose**: List of DiscussionCards with category filtering and load more.
**Props**:
```js
{
  discussions: [],
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => void,
}
```
**Renders**: Vertical stack of DiscussionCards with `gap: 16`, load more button.
**Style**: Same as QuestionList.

#### `components/discussions/DiscussionDetail.jsx`
**Purpose**: Full discussion thread view.
**Props**:
```js
{
  discussion: {
    id, slug, title, body,
    category,
    likeCount,
    author: { id, name, username, avatar },
    createdAt,
    userHasLiked: boolean,
  },
  replies: [{
    id, body, likeCount,
    author: { id, name, username, avatar },
    createdAt,
    parentId: null | number,      // for threading
    children: [],                  // nested replies
    userHasLiked: boolean,
  }],
}
```
**Renders**: Title (h1, 28px), CategoryBadge, author section, body (prose), like + share buttons, divider, reply count header, threaded ReplyCards, ReplyForm at bottom.
**Style**: Single column layout, `maxWidth: 800, margin: "0 auto", padding: "32px 24px"`. Same prose styling as PostPageContent.

#### `components/discussions/ReplyCard.jsx`
**Purpose**: Single reply in a discussion thread, supports nesting.
**Props**:
```js
{
  reply: {
    id, body, likeCount,
    author: { id, name, username, avatar },
    createdAt,
    userHasLiked: boolean,
    children: [],
  },
  depth: number,                   // 0 = top-level, 1+ = nested
  onReply: (parentId) => void,
}
```
**Renders**: Avatar + name + time header, body text, like button + "Reply" link. If children exist, recursively render ReplyCards indented. Max depth: 3 (deeper replies flatten).
**Style**: `paddingLeft: depth * 32`, left border for nested: `borderLeft: depth > 0 ? "2px solid var(--border-color)" : "none"`. Author line: `display: "flex", alignItems: "center", gap: 10`. Same comment styling pattern as CommentSection.jsx.

#### `components/discussions/ReplyForm.jsx`
**Purpose**: Simple textarea for posting replies.
**Props**:
```js
{
  discussionSlug: string,
  parentId?: number,               // null for top-level, ID for nested reply
  onSubmit: (reply) => void,
  onCancel?: () => void,
  autoFocus?: boolean,
}
```
**Renders**: TextArea (same as CommentSection) + "Post Reply" button. When replying to a specific reply, shows "Replying to @username" label + cancel button.
**Style**: Same as CommentSection's add comment section. `TextArea` with `borderRadius: 12, resize: "none"`, rows=3. Button: `type="primary" shape="round"`.

#### `components/discussions/CategoryBadge.jsx`
**Purpose**: Colored pill/badge showing discussion category.
**Props**:
```js
{
  category: string,                // "general" | "help" | "show-and-tell" | "ideas" | "off-topic"
  size?: "small" | "default",
}
```
**Renders**: Ant `<Tag>` with category-specific color.
**Color Map**:
```js
const CATEGORY_COLORS = {
  general: "blue",
  help: "orange",
  "show-and-tell": "green",
  ideas: "purple",
  "off-topic": "default",
};
```
**Style**: `borderRadius: 12, padding: size === "small" ? "0 8px" : "2px 12px"`.

---

### 3.3 AI Assistant Components

#### `components/ai/ChatInterface.jsx`
**Purpose**: Main chat container managing message list, input, and source display.
**Props**:
```js
{
  conversationId?: string,         // null for new conversation
  onConversationCreated: (id) => void,
}
```
**State**: `messages[]`, `isStreaming`, `sources[]`
**Renders**: Scrollable message area (flex-grow, overflow-y auto) with ChatMessages, sources panel below assistant messages that have sources, ChatInput fixed at bottom.
**Style**:
```js
// Container
{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }
// Message area
{ flex: 1, overflowY: "auto", padding: "24px", maxWidth: 800, margin: "0 auto", width: "100%" }
// Input area
{ borderTop: "1px solid var(--border-color)", background: "var(--nav-bg)", backdropFilter: "blur(12px)" }
```

#### `components/ai/ChatMessage.jsx`
**Purpose**: Single chat message bubble.
**Props**:
```js
{
  message: {
    role: "user" | "assistant",
    content: string,               // markdown for assistant, plain text for user
    sources?: [{ title, slug, type, excerpt }],
    createdAt,
  },
  isStreaming?: boolean,
}
```
**Renders**: User messages: right-aligned, blue background pill. Assistant messages: left-aligned, card-style with prose rendering for markdown. Streaming state shows typing indicator (3 pulsing dots).
**Style**:
```js
// User bubble
{
  background: "#2563eb", color: "#fff", borderRadius: "16px 16px 4px 16px",
  padding: "12px 16px", maxWidth: "75%", marginLeft: "auto",
  fontSize: 15, lineHeight: 1.6,
}
// Assistant bubble
{
  background: isDark ? "#1e293b" : "#f8fafc",
  borderRadius: "16px 16px 16px 4px",
  padding: "16px 20px", maxWidth: "85%",
  border: "1px solid var(--border-color)",
}
```

#### `components/ai/ChatInput.jsx`
**Purpose**: Message input bar with send button.
**Props**:
```js
{
  onSend: (message: string) => void,
  disabled?: boolean,
  placeholder?: string,
}
```
**Renders**: Ant `<Input.TextArea>` with autoSize (min 1, max 4 rows) + Send button (icon only, circle, primary).
**Style**: Same input radius (20) as navbar search. Container: `maxWidth: 800, margin: "0 auto", padding: "16px 24px"`.

#### `components/ai/SourceCard.jsx`
**Purpose**: Compact card showing a source document referenced by the AI.
**Props**:
```js
{
  source: {
    title: string,
    slug: string,
    type: "post" | "question" | "discussion",
    excerpt: string,
    relevanceScore?: number,
  }
}
```
**Renders**: Small horizontal card with content type icon, title (link to source), 1-line excerpt.
**Style**: `borderRadius: 12, padding: "10px 14px", border: "1px solid var(--border-color)"`, inline-flex, `fontSize: 13`.

#### `components/ai/ConversationSidebar.jsx`
**Purpose**: Left sidebar listing past AI conversations.
**Props**:
```js
{
  conversations: [{ id, title, lastMessageAt, messageCount }],
  activeId?: string,
  onSelect: (id) => void,
  onNew: () => void,
}
```
**Renders**: "New Chat" button at top + list of conversation items (title, relative time). Active conversation highlighted.
**Style**:
```js
// Sidebar container
{
  width: 280, borderRight: "1px solid var(--border-color)",
  height: "calc(100vh - 64px)", overflowY: "auto",
  padding: "16px",
}
// Active item
{ background: "rgba(37,99,235,0.1)", borderRadius: 10 }
```
**Responsive**: Hidden on mobile, accessible via a drawer toggle.

---

### 3.4 Shared/Common Components

#### `components/shared/VoteWidget.jsx`
**Purpose**: Generic reusable vote component (used by both questions and answers).
**Props**:
```js
{
  entityType: "question" | "answer",
  entityId: number,
  initialVoteCount: number,
  initialUserVote: 1 | -1 | 0,
  size?: "default" | "small",
  orientation?: "vertical" | "horizontal",  // vertical for sidebar, horizontal for inline
}
```
**Renders**: Wraps VoteButtons with API call logic. Calls `useVotes()` hook internally to handle `POST /votes`.
**Style**: Delegates to VoteButtons for visual rendering.

#### `components/shared/ReputationBadge.jsx`
**Purpose**: Displays user reputation score with icon.
**Props**:
```js
{
  reputation: number,
  size?: "small" | "default" | "large",
  showIcon?: boolean,              // default true
}
```
**Renders**: Star/trophy icon + formatted number (uses `formatNumber` util). Gold color for top users (>10K), silver for >1K, bronze for others.
**Style**: `display: "inline-flex", alignItems: "center", gap: 4`, icon color varies by tier.

#### `components/shared/ContentTabs.jsx`
**Purpose**: Reusable tab/segmented navigation for switching between content types.
**Props**:
```js
{
  tabs: [{ key: string, label: string, count?: number }],
  activeKey: string,
  onChange: (key) => void,
  size?: "default" | "large",
}
```
**Renders**: Ant `<Segmented>` component (same as ArticleFeed uses). Each option shows label + optional count badge.
**Style**: Same as `ArticleFeed`'s Segmented: `size="large"`.

#### `components/shared/TagBadge.jsx`
**Purpose**: Enhanced tag chip for use across questions, discussions, posts.
**Props**:
```js
{
  tag: { name, slug, color? },
  linked?: boolean,                // default true, wraps in Link to /tags/${slug}
  size?: "small" | "default",
  closable?: boolean,              // for tag input
  onClose?: () => void,
}
```
**Renders**: Ant `<Tag>` with `color="blue"` (or custom color), wrapped in `<Link>` if linked. Same styling as existing tags.
**Style**: `borderRadius: 12, margin: 0, cursor: "pointer", padding: "2px 10px"`. Follows existing ArticleCard tag styling.

#### `components/shared/EmptyState.jsx`
**Purpose**: Empty state placeholder for lists with no results.
**Props**:
```js
{
  icon?: ReactNode,                // Ant Design icon, e.g. <InboxOutlined />
  title: string,
  description?: string,
  action?: { label: string, href?: string, onClick?: () => void },
}
```
**Renders**: Centered div with large faded icon, title text, description text, optional action button.
**Style**:
```js
{
  textAlign: "center", padding: "64px 24px",
}
// Icon: fontSize: 48, color: "var(--text-secondary)", opacity: 0.3
// Title: fontSize: 18, fontWeight: 600, marginBottom: 8
// Description: fontSize: 14, color: "var(--text-secondary)"
// Action button: type="primary" shape="round", marginTop: 16
```

#### `components/shared/InfiniteScrollWrapper.jsx`
**Purpose**: Wraps content lists with "Load More" button (not infinite scroll observer — matches existing ArticleFeed pattern).
**Props**:
```js
{
  children: ReactNode,
  hasMore: boolean,
  loading: boolean,
  onLoadMore: () => void,
  loadingComponent?: ReactNode,    // custom skeleton
}
```
**Renders**: Children + conditional "Load More" button at bottom + optional loading skeleton when loading.
**Style**: Load more button: centered, `marginTop: 40`, `<Button size="large" shape="round">`.

#### `components/shared/UserMiniCard.jsx`
**Purpose**: Compact user display for search results, leaderboard.
**Props**:
```js
{
  user: {
    name, username, avatar, bio,
    reputation?: number,
    postsCount?: number,
  },
  showReputation?: boolean,
}
```
**Renders**: Horizontal card: avatar (size 44) + name + @username + bio excerpt + optional reputation badge.
**Style**: `display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12`.

#### `components/shared/ContentEditor.jsx`
**Purpose**: Shared TipTap rich text editor wrapper for questions, answers, and discussions. Thin wrapper around RichTextEditor with configurable placeholder and size.
**Props**:
```js
{
  content: string,
  onChange: (markdown: string) => void,
  placeholder?: string,            // default: "Write your content..."
  minHeight?: number,              // default: 200
}
```
**Renders**: Wraps `RichTextEditor` with custom placeholder and min-height. Uses same lazy loading pattern.
**Style**: Same as existing RichTextEditor. Adjusts `editorProps.attributes.style` minHeight.

---

### 3.5 Layout Components

#### `components/layout/Navbar.jsx` (MODIFY)
**Changes**:
1. Update `NAV_LINKS` to include Q&A and Discussions (constants.js change)
2. Add `<NotificationBell />` component in the actions area (between ThemeToggle and Write button)
3. Add AI Assistant link as an icon button (robot icon)
4. Mobile drawer: add new links

#### `components/layout/NotificationBell.jsx`
**Purpose**: Notification icon with unread count badge + dropdown.
**Props**: None (uses `useNotifications` hook and `notificationStore`)
**Renders**: Ant `<Dropdown>` triggered by a bell icon `<Button>`. Badge shows unread count. Dropdown menu shows recent notifications (max 10) with "Mark all read" and "View all" links.
**Style**: Bell icon: `type="text" shape="circle"`. Badge: Ant `<Badge>` with `count={unreadCount}` on the button. Dropdown items: avatar + text + relative time, same compact style.

---

### 3.6 Home Feed Components

#### `components/home/QuestionFeed.jsx`
**Purpose**: Recent questions feed for home page Questions tab.
**Props**: None (fetches internally)
**Data**: `GET /questions?sort=latest&limit=10`
**Renders**: QuestionList with 10 items + "View All Questions" link button.
**Style**: Same as ArticleFeed pattern.

#### `components/home/DiscussionFeed.jsx`
**Purpose**: Recent discussions feed for home page Discussions tab.
**Props**: None (fetches internally)
**Data**: `GET /discussions?limit=10`
**Renders**: DiscussionList with 10 items + "View All Discussions" link button.
**Style**: Same as ArticleFeed pattern.

---

### 3.7 Profile Tab Components

#### `components/profile/ProfileQuestions.jsx`
**Props**: `{ username: string }`
**Data**: `GET /users/:username/questions`
**Renders**: QuestionList of user's questions.

#### `components/profile/ProfileAnswers.jsx`
**Props**: `{ username: string }`
**Data**: `GET /users/:username/answers`
**Renders**: List of AnswerCards (each showing question title link + answer excerpt + vote count).

#### `components/profile/ProfileBadges.jsx`
**Props**: `{ username: string }`
**Data**: `GET /users/:username/badges`
**Renders**: Grid of badge cards (icon, name, description, earned date).
**Style**: `display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16`.

---

### 3.8 Tags Components

#### `components/tags/TagGrid.jsx`
**Props**:
```js
{
  tags: [{ name, slug, description, color, postCount, questionCount, followerCount }],
  loading: boolean,
}
```
**Renders**: Responsive grid of tag cards. Each card: tag name (bold), description (2 lines), post count + question count stats.
**Style**: `display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20`. Card: `borderRadius: 16`, top border accent: `borderTop: "3px solid ${tag.color || '#2563eb'}"`.

#### `components/tags/TagDetailContent.jsx`
**Props**:
```js
{
  tag: { name, slug, description, color, postCount, questionCount, followerCount, isFollowing },
  posts: [],
  questions: [],
}
```
**Renders**: Tag header + ContentTabs (Posts | Questions) + respective content lists.

---

### 3.9 Leaderboard Components

#### `components/leaderboard/LeaderboardTable.jsx`
**Props**:
```js
{
  users: [{ rank, name, username, avatar, reputation, answerCount, badgeCount }],
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => void,
}
```
**Renders**: Table-like layout (not Ant Table to match existing card-style patterns). Each row: rank number, avatar + name (link to profile), reputation badge, answers count, badges count. Top 3 get gold/silver/bronze highlight.
**Style**: Each row is a flex container: `display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border-color)"`. Top 3: `background: "rgba(37,99,235,0.04)"`. Rank: `fontSize: 18, fontWeight: 800, minWidth: 40`.

---

### 3.10 Settings Components

#### `components/settings/SettingsLayout.jsx`
**Props**: `{ children, activeTab }`
**Renders**: Two-column layout. Left: navigation menu (Profile, Notifications, Account). Right: children (active panel).
**Style**: Grid: `gridTemplateColumns: "220px 1fr"`, `gap: 32`. Nav items: same style as Sidebar tag items.

#### `components/settings/ProfileSettings.jsx`
**Props**: None (uses useAuth + useUser internally)
**Renders**: Form with avatar upload, name, username, bio, location, website, twitter, github inputs. Save button.
**Style**: Vertical stack, `gap: 20`. Labels: `fontSize: 13, fontWeight: 500`. Inputs: `borderRadius: 12`. Same form pattern as SignInPage.

#### `components/settings/NotificationSettings.jsx`
**Renders**: Toggles for: email on new follower, email on comment reply, email on answer to question, email on discussion reply, email weekly digest.
**Style**: Each toggle: flex row with label + Ant `<Switch>`. `gap: 16`, `padding: "16px 0"`, `borderBottom: "1px solid var(--border-color)"`.

#### `components/settings/AccountSettings.jsx`
**Renders**: Change password section + danger zone (delete account with Popconfirm).
**Style**: Card-based sections. Danger zone: `border: "1px solid #ef4444"`, `borderRadius: 16`.

---

### 3.11 Search Components

#### `components/search/UnifiedSearchResults.jsx`
**Props**:
```js
{
  results: {
    posts: [], questions: [], discussions: [], users: [],
  },
  query: string,
  activeType: "all" | "posts" | "questions" | "discussions" | "users",
  loading: boolean,
}
```
**Renders**: Based on activeType — "all" shows grouped sections (Posts header + ArticleCards, Questions header + QuestionCards, etc.), specific type shows only that type's results with load more.
**Style**: Each section: `marginBottom: 40`. Section header: `<Title level={4}>`, count badge. Same grid layouts as respective list pages.

---

## 4. ALL NEW HOOKS

### 4.1 `hooks/useQuestions.js`
```js
export function useQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /questions?sort=&tag=&page=&limit=
  const fetchQuestions = useCallback(async (params) => { ... }, []);

  // GET /questions/:slug
  const fetchBySlug = useCallback(async (slug) => { ... }, []);

  // POST /questions { title, body, tags, custom_tags }
  const createQuestion = useCallback(async (data) => { ... }, []);

  // PATCH /questions/:slug { title, body, tags }
  const updateQuestion = useCallback(async (slug, data) => { ... }, []);

  // DELETE /questions/:slug
  const deleteQuestion = useCallback(async (slug) => { ... }, []);

  return { loading, error, fetchQuestions, fetchBySlug, createQuestion, updateQuestion, deleteQuestion };
}
```

### 4.2 `hooks/useAnswers.js`
```js
export function useAnswers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /questions/:slug/answers
  const fetchAnswers = useCallback(async (questionSlug, params) => { ... }, []);

  // POST /questions/:slug/answers { body }
  const createAnswer = useCallback(async (questionSlug, data) => { ... }, []);

  // PATCH /answers/:id { body }
  const updateAnswer = useCallback(async (id, data) => { ... }, []);

  // DELETE /answers/:id
  const deleteAnswer = useCallback(async (id) => { ... }, []);

  // POST /answers/:id/accept
  const acceptAnswer = useCallback(async (id) => { ... }, []);

  return { loading, error, fetchAnswers, createAnswer, updateAnswer, deleteAnswer, acceptAnswer };
}
```

### 4.3 `hooks/useVotes.js`
```js
export function useVotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // POST /votes { entity_type: "question"|"answer", entity_id, value: 1|-1 }
  // If user already voted same way, it removes the vote. If opposite, it flips.
  const vote = useCallback(async (entityType, entityId, value) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/votes', { entity_type: entityType, entity_id: entityId, value });
      return res.data; // { newVoteCount, userVote }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /votes?entity_type=&entity_id= (get current user's vote)
  const getUserVote = useCallback(async (entityType, entityId) => { ... }, []);

  return { loading, error, vote, getUserVote };
}
```

### 4.4 `hooks/useDiscussions.js`
```js
export function useDiscussions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /discussions?category=&page=&limit=
  const fetchDiscussions = useCallback(async (params) => { ... }, []);

  // GET /discussions/:slug
  const fetchBySlug = useCallback(async (slug) => { ... }, []);

  // POST /discussions { title, body, category }
  const createDiscussion = useCallback(async (data) => { ... }, []);

  // GET /discussions/:slug/replies
  const fetchReplies = useCallback(async (slug) => { ... }, []);

  // POST /discussions/:slug/replies { body, parent_id? }
  const createReply = useCallback(async (slug, data) => { ... }, []);

  // POST /discussions/:slug/like
  const likeDiscussion = useCallback(async (slug) => { ... }, []);

  // DELETE /discussions/:slug/like
  const unlikeDiscussion = useCallback(async (slug) => { ... }, []);

  // POST /discussions/replies/:id/like
  const likeReply = useCallback(async (id) => { ... }, []);

  // DELETE /discussions/replies/:id/like
  const unlikeReply = useCallback(async (id) => { ... }, []);

  return {
    loading, error,
    fetchDiscussions, fetchBySlug, createDiscussion,
    fetchReplies, createReply,
    likeDiscussion, unlikeDiscussion, likeReply, unlikeReply,
  };
}
```

### 4.5 `hooks/useSearch.js`
```js
export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /search?q=&type=all|posts|questions|discussions|users&page=&limit=
  const search = useCallback(async (query, type = "all", params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/search', { params: { q: query, type, ...params } });
      return res.data;
      // Returns: { posts: [], questions: [], discussions: [], users: [], counts: { posts, questions, discussions, users } }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, search };
}
```

### 4.6 `hooks/useNotifications.js`
```js
export function useNotifications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /notifications?page=&limit=
  const fetchNotifications = useCallback(async (params) => { ... }, []);

  // GET /notifications/unread-count
  const fetchUnreadCount = useCallback(async () => { ... }, []);

  // PATCH /notifications/:id/read
  const markRead = useCallback(async (id) => { ... }, []);

  // PATCH /notifications/read-all
  const markAllRead = useCallback(async () => { ... }, []);

  return { loading, error, fetchNotifications, fetchUnreadCount, markRead, markAllRead };
}
```

### 4.7 `hooks/useRag.js`
```js
export function useRag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // POST /rag/ask { question, conversation_id? }
  // Returns: { answer, sources: [...], conversation_id }
  const ask = useCallback(async (question, conversationId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/rag/ask', { question, conversation_id: conversationId });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /rag/conversations
  const getConversations = useCallback(async () => { ... }, []);

  // GET /rag/conversations/:id
  const getConversation = useCallback(async (id) => { ... }, []);

  // DELETE /rag/conversations/:id
  const deleteConversation = useCallback(async (id) => { ... }, []);

  return { loading, error, ask, getConversations, getConversation, deleteConversation };
}
```

---

## 5. STORES

### 5.1 `stores/authStore.js` (MODIFY)
Add reputation and badges fields to the persisted user state.

```js
// ADDITIONS to existing store shape:
// user object now includes:
//   reputation: number (default 0)
//   badges: { gold: number, silver: number, bronze: number } (default { gold: 0, silver: 0, bronze: 0 })
//   answersCount: number (default 0)
//   questionsCount: number (default 0)

// Add new action:
updateReputation: (reputation) => set((state) => ({
  user: { ...state.user, reputation }
})),
```

### 5.2 `stores/notificationStore.js` (NEW)
```js
import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  unreadCount: 0,
  notifications: [],

  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  clearUnread: () => set({ unreadCount: 0 }),
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
}));
```

NOTE: No `persist` middleware for notifications — they are fetched fresh on each page load (polling or WebSocket can be added later). This keeps localStorage lean.

---

## 6. UPDATED ENDPOINTS

### `lib/endpoints.js` (Full replacement)

```js
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  // ═══════════════════════════════════
  // Auth
  // ═══════════════════════════════════
  AUTH_LOGIN: `${API}/auth/login`,
  AUTH_REGISTER: `${API}/auth/register`,
  AUTH_ME: `${API}/auth/me`,

  // ═══════════════════════════════════
  // Posts (existing)
  // ═══════════════════════════════════
  POSTS: `${API}/posts`,
  POSTS_SEARCH: `${API}/posts/search`,
  POSTS_DRAFTS: `${API}/posts/drafts`,
  POSTS_FEED: `${API}/posts/feed`,
  POST_BY_SLUG: (slug) => `${API}/posts/${slug}`,
  POST_LIKE: (slug) => `${API}/posts/${slug}/like`,
  POST_BOOKMARK: (slug) => `${API}/posts/${slug}/bookmark`,
  POST_VIEWS: (slug) => `${API}/posts/${slug}/views`,

  // ═══════════════════════════════════
  // Questions (NEW)
  // ═══════════════════════════════════
  QUESTIONS: `${API}/questions`,
  QUESTION_BY_SLUG: (slug) => `${API}/questions/${slug}`,
  QUESTION_ANSWERS: (slug) => `${API}/questions/${slug}/answers`,
  QUESTION_BOOKMARK: (slug) => `${API}/questions/${slug}/bookmark`,

  // ═══════════════════════════════════
  // Answers (NEW)
  // ═══════════════════════════════════
  ANSWER_BY_ID: (id) => `${API}/answers/${id}`,
  ANSWER_ACCEPT: (id) => `${API}/answers/${id}/accept`,

  // ═══════════════════════════════════
  // Votes (NEW)
  // ═══════════════════════════════════
  VOTES: `${API}/votes`,

  // ═══════════════════════════════════
  // Discussions (NEW)
  // ═══════════════════════════════════
  DISCUSSIONS: `${API}/discussions`,
  DISCUSSION_BY_SLUG: (slug) => `${API}/discussions/${slug}`,
  DISCUSSION_REPLIES: (slug) => `${API}/discussions/${slug}/replies`,
  DISCUSSION_LIKE: (slug) => `${API}/discussions/${slug}/like`,
  DISCUSSION_REPLY_LIKE: (replyId) => `${API}/discussions/replies/${replyId}/like`,

  // ═══════════════════════════════════
  // Users (existing + enhanced)
  // ═══════════════════════════════════
  USER_PROFILE: (username) => `${API}/users/${username}`,
  USER_FOLLOW: (username) => `${API}/users/${username}/follow`,
  USER_POSTS: (username) => `${API}/users/${username}/posts`,
  USER_QUESTIONS: (username) => `${API}/users/${username}/questions`,  // NEW
  USER_ANSWERS: (username) => `${API}/users/${username}/answers`,      // NEW
  USER_BADGES: (username) => `${API}/users/${username}/badges`,        // NEW
  USER_NOTIFICATIONS_SETTINGS: (username) => `${API}/users/${username}/notifications`,  // NEW

  // ═══════════════════════════════════
  // Comments (existing)
  // ═══════════════════════════════════
  COMMENTS_BY_POST: (slug) => `${API}/comments/post/${slug}`,
  COMMENT_BY_ID: (id) => `${API}/comments/${id}`,
  COMMENT_LIKE: (id) => `${API}/comments/${id}/like`,

  // ═══════════════════════════════════
  // Tags (existing + enhanced)
  // ═══════════════════════════════════
  TAGS: `${API}/tags`,
  TAG_BY_SLUG: (slug) => `${API}/tags/${slug}`,
  TAG_POSTS: (slug) => `${API}/tags/${slug}/posts`,
  TAG_QUESTIONS: (slug) => `${API}/tags/${slug}/questions`,            // NEW
  TAG_FOLLOW: (slug) => `${API}/tags/${slug}/follow`,                  // NEW

  // ═══════════════════════════════════
  // Bookmarks (existing)
  // ═══════════════════════════════════
  BOOKMARKS: `${API}/bookmarks`,

  // ═══════════════════════════════════
  // Notifications (existing + enhanced)
  // ═══════════════════════════════════
  NOTIFICATIONS: `${API}/notifications`,
  NOTIFICATIONS_UNREAD: `${API}/notifications/unread-count`,
  NOTIFICATION_READ: (id) => `${API}/notifications/${id}/read`,        // NEW
  NOTIFICATIONS_READ_ALL: `${API}/notifications/read-all`,             // NEW

  // ═══════════════════════════════════
  // Search (NEW — unified)
  // ═══════════════════════════════════
  SEARCH: `${API}/search`,

  // ═══════════════════════════════════
  // RAG / AI Assistant (NEW)
  // ═══════════════════════════════════
  RAG_ASK: `${API}/rag/ask`,
  RAG_CONVERSATIONS: `${API}/rag/conversations`,
  RAG_CONVERSATION: (id) => `${API}/rag/conversations/${id}`,

  // ═══════════════════════════════════
  // Leaderboard (NEW)
  // ═══════════════════════════════════
  LEADERBOARD: `${API}/leaderboard`,

  // ═══════════════════════════════════
  // Uploads (existing)
  // ═══════════════════════════════════
  UPLOADS: `${API}/uploads`,

  // ═══════════════════════════════════
  // Health (existing)
  // ═══════════════════════════════════
  HEALTH: `${API}/health`,
};
```

---

## 7. UPDATED CONSTANTS

### `lib/constants.js` (MODIFY)

```js
export const SITE_NAME = "Scriptly";
export const SITE_DESCRIPTION = "Where developers write, ask, discuss, and grow together";
export const SITE_URL = "https://scriptly.dev";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Q&A", href: "/questions" },
  { label: "Discussions", href: "/discussions" },
  { label: "Bookmarks", href: "/bookmarks" },
];

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "Discord", href: "https://discord.com", icon: "discord" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];

// NEW: Discussion categories
export const DISCUSSION_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "general", label: "General", color: "blue" },
  { key: "help", label: "Help", color: "orange" },
  { key: "show-and-tell", label: "Show & Tell", color: "green" },
  { key: "ideas", label: "Ideas", color: "purple" },
  { key: "off-topic", label: "Off-topic", color: "default" },
];

// NEW: Question sort options
export const QUESTION_SORT_OPTIONS = [
  { key: "latest", label: "Latest" },
  { key: "votes", label: "Votes" },
  { key: "unanswered", label: "Unanswered" },
  { key: "active", label: "Active" },
];

// NEW: Leaderboard periods
export const LEADERBOARD_PERIODS = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "all", label: "All Time" },
];

// NEW: Content types for search
export const SEARCH_TYPES = [
  { key: "all", label: "All" },
  { key: "posts", label: "Posts" },
  { key: "questions", label: "Questions" },
  { key: "discussions", label: "Discussions" },
  { key: "users", label: "Users" },
];

// NEW: Reputation tiers
export const REPUTATION_TIERS = {
  GOLD: 10000,
  SILVER: 1000,
  BRONZE: 0,
};
```

---

## 8. UPDATED NORMALIZERS

### `lib/normalizers.js` (MODIFY — add these exports)

```js
// EXISTING: normalizePost, normalizeComment, normalizeUser — NO CHANGE

// NEW:
export function normalizeQuestion(apiQuestion) {
  if (!apiQuestion) return null;
  return {
    id: apiQuestion.id,
    slug: apiQuestion.slug,
    title: apiQuestion.title,
    body: apiQuestion.body,
    excerpt: apiQuestion.excerpt,
    voteCount: apiQuestion.vote_count || 0,
    answerCount: apiQuestion.answer_count || 0,
    viewCount: apiQuestion.view_count || 0,
    hasAcceptedAnswer: !!apiQuestion.has_accepted_answer,
    userVote: apiQuestion.user_vote || 0,             // 1, -1, or 0
    tags: apiQuestion.tags || [],
    author: {
      id: apiQuestion.author_id,
      name: apiQuestion.author_name,
      username: apiQuestion.author_username,
      avatar: apiQuestion.author_avatar,
    },
    createdAt: apiQuestion.created_at,
    updatedAt: apiQuestion.updated_at,
  };
}

export function normalizeAnswer(apiAnswer) {
  if (!apiAnswer) return null;
  return {
    id: apiAnswer.id,
    body: apiAnswer.body,
    voteCount: apiAnswer.vote_count || 0,
    isAccepted: !!apiAnswer.is_accepted,
    userVote: apiAnswer.user_vote || 0,
    author: {
      id: apiAnswer.author_id,
      name: apiAnswer.author_name,
      username: apiAnswer.author_username,
      avatar: apiAnswer.author_avatar,
    },
    comments: (apiAnswer.comments || []).map(normalizeComment),
    createdAt: apiAnswer.created_at,
    updatedAt: apiAnswer.updated_at,
  };
}

export function normalizeDiscussion(apiDiscussion) {
  if (!apiDiscussion) return null;
  return {
    id: apiDiscussion.id,
    slug: apiDiscussion.slug,
    title: apiDiscussion.title,
    body: apiDiscussion.body,
    excerpt: apiDiscussion.excerpt,
    category: apiDiscussion.category,
    replyCount: apiDiscussion.reply_count || 0,
    likeCount: apiDiscussion.like_count || 0,
    userHasLiked: !!apiDiscussion.user_has_liked,
    author: {
      id: apiDiscussion.author_id,
      name: apiDiscussion.author_name,
      username: apiDiscussion.author_username,
      avatar: apiDiscussion.author_avatar,
    },
    lastReplyAt: apiDiscussion.last_reply_at,
    createdAt: apiDiscussion.created_at,
  };
}

export function normalizeReply(apiReply) {
  if (!apiReply) return null;
  return {
    id: apiReply.id,
    body: apiReply.body,
    likeCount: apiReply.like_count || 0,
    userHasLiked: !!apiReply.user_has_liked,
    parentId: apiReply.parent_id || null,
    author: {
      id: apiReply.author_id,
      name: apiReply.author_name,
      username: apiReply.author_username,
      avatar: apiReply.author_avatar,
    },
    children: (apiReply.children || []).map(normalizeReply),
    createdAt: apiReply.created_at,
  };
}

export function normalizeNotification(apiNotification) {
  if (!apiNotification) return null;
  return {
    id: apiNotification.id,
    type: apiNotification.type,             // "answer" | "comment" | "vote" | "follow" | "mention" | "accept"
    message: apiNotification.message,
    isRead: !!apiNotification.is_read,
    entityType: apiNotification.entity_type, // "question" | "answer" | "post" | "discussion"
    entitySlug: apiNotification.entity_slug,
    actor: {
      name: apiNotification.actor_name,
      username: apiNotification.actor_username,
      avatar: apiNotification.actor_avatar,
    },
    createdAt: apiNotification.created_at,
  };
}

export function normalizeConversation(apiConv) {
  if (!apiConv) return null;
  return {
    id: apiConv.id,
    title: apiConv.title,
    messageCount: apiConv.message_count || 0,
    lastMessageAt: apiConv.last_message_at,
    createdAt: apiConv.created_at,
  };
}
```

---

## 9. UPDATED UTILS

### `lib/utils.js` (MODIFY — add these exports)

```js
// EXISTING: cn, formatDate, getRelativeTime, calculateReadTime, formatNumber, getDefaultCover — NO CHANGE

// NEW:
export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || singular + "s");
}

export function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + "...";
}

export function getVoteColor(userVote) {
  if (userVote === 1) return "#2563eb";
  if (userVote === -1) return "#ef4444";
  return "var(--text-secondary)";
}

export function getCategoryLabel(category) {
  const map = {
    general: "General",
    help: "Help",
    "show-and-tell": "Show & Tell",
    ideas: "Ideas",
    "off-topic": "Off-topic",
  };
  return map[category] || category;
}

export function getReputationTier(reputation) {
  if (reputation >= 10000) return "gold";
  if (reputation >= 1000) return "silver";
  return "bronze";
}

export function getReputationColor(reputation) {
  const tier = getReputationTier(reputation);
  if (tier === "gold") return "#f59e0b";
  if (tier === "silver") return "#94a3b8";
  return "#b45309";
}

export function buildThreadTree(flatReplies) {
  // Convert flat list of replies (with parent_id) to nested tree
  const map = {};
  const roots = [];
  flatReplies.forEach((r) => { map[r.id] = { ...r, children: [] }; });
  flatReplies.forEach((r) => {
    if (r.parentId && map[r.parentId]) {
      map[r.parentId].children.push(map[r.id]);
    } else {
      roots.push(map[r.id]);
    }
  });
  return roots;
}
```

---

## 10. CSS ADDITIONS

### `app/globals.css` (MODIFY — append these rules)

```css
/* ═══════════════════════════════════════ */
/* COMMUNITY PAGES — Questions, Discussions */
/* ═══════════════════════════════════════ */

/* Questions list grid */
.questions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Discussions grid */
.discussions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* AI Chat layout */
.ai-chat-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: calc(100vh - 64px);
}

/* Settings layout */
.settings-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
}

/* Tags grid */
.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

/* Leaderboard rows */
.leaderboard-row:hover {
  background: rgba(37,99,235,0.04);
}
.dark .leaderboard-row:hover {
  background: rgba(37,99,235,0.08);
}

/* Vote button hover */
.vote-btn:hover {
  color: #2563eb !important;
  transform: scale(1.1);
}

/* Chat message animation */
.chat-message-enter {
  animation: slideUp 0.2s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Typing indicator dots */
.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: typingPulse 1.4s infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingPulse {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

/* ═══════════════════════════════════════ */
/* RESPONSIVE — New pages                  */
/* ═══════════════════════════════════════ */

/* Tablet and below (<=1024px) */
@media (max-width: 1024px) {
  /* Existing rules (home-grid, sidebar-desktop, etc.) remain */
  .questions-sidebar { display: none; }
  .ai-chat-layout { grid-template-columns: 1fr; }
  .ai-sidebar { display: none; }
  .settings-grid { grid-template-columns: 1fr; }
  .settings-nav { display: none; }
  .tag-detail-sidebar { display: none; }
  .question-detail-grid { grid-template-columns: 1fr !important; }
}

/* Mobile (<=768px) */
@media (max-width: 768px) {
  /* Existing rules remain */
  .tags-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
  .leaderboard-stats { display: none; }
  .question-vote-desktop { display: none; }
  .question-vote-mobile { display: flex !important; }
}

/* Small phones (<=480px) */
@media (max-width: 480px) {
  /* Existing rules remain */
  .tags-grid { grid-template-columns: 1fr !important; }
}
```

---

## 11. DESIGN SYSTEM REFERENCE

### Typography Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero h1 | 48px | 900 | 1.1 |
| Page title (h1) | 36px / 28px | 800 | 1.2 |
| Section title (h2/Title level 2) | 24px | 700 | 1.3 |
| Subsection (h3/Title level 3) | 20px | 600 | 1.3 |
| Card title | 16-18px | 600 | 1.4 |
| Body text | 15-17px | 400 | 1.7-1.8 |
| Secondary text | 13-14px | 400/500 | 1.5-1.6 |
| Meta text (time, counts) | 12px | 400 | 1.4 |
| Code | 14px | 400 | 1.7 |

### Spacing System
| Context | Value |
|---------|-------|
| Page max-width | 1280px |
| Page padding | 40px 24px (mobile: 24px 16px) |
| Card padding | 20px |
| Grid gap (major) | 40px |
| Grid gap (cards) | 24px |
| Grid gap (list items) | 16px |
| Section gap | 32px |
| Component internal gap | 8-12px |
| Border radius (card) | 16px |
| Border radius (button) | 20px (shape="round") |
| Border radius (tag) | 12px |
| Border radius (input) | 12px |
| Border radius (avatar) | 50% |

### Interactive States
| State | Pattern |
|-------|---------|
| Hover card | Ant `hoverable` prop |
| Active nav link | `color: "#2563eb", background: "rgba(37,99,235,0.1)"` |
| Like active | `color: "#ef4444"` |
| Bookmark active | `color: "#2563eb"` |
| Upvote active | `color: "#2563eb"` |
| Downvote active | `color: "#ef4444"` |
| Accepted answer | `color: "#22c55e"`, green border |
| Transition | `transition: "all 0.2s"` |

### Key Icon Set (from @ant-design/icons)
| Purpose | Icon |
|---------|------|
| Upvote | `<CaretUpOutlined />` / `<CaretUpFilled />` |
| Downvote | `<CaretDownOutlined />` / `<CaretDownFilled />` |
| Accept | `<CheckCircleOutlined />` / `<CheckCircleFilled />` |
| Questions | `<QuestionCircleOutlined />` |
| Discussions | `<CommentOutlined />` |
| AI Assistant | `<RobotOutlined />` |
| Notification | `<BellOutlined />` / `<BellFilled />` |
| Reputation | `<TrophyOutlined />` |
| Badge | `<SafetyCertificateOutlined />` |
| Leaderboard | `<CrownOutlined />` |
| Settings | `<SettingOutlined />` |
| Reply | `<MessageOutlined />` |
| View count | `<EyeOutlined />` |
| Tags | `<TagOutlined />` |
| Search (unified) | `<SearchOutlined />` |

---

## 12. DATA FLOW SUMMARY

### Authentication Flow (unchanged)
1. User signs in via `/signin` -> `useAuth().login()` -> `api.post('/auth/login')` -> `authStore.setAuth(user, token)`
2. Token persisted in localStorage under `devblog-auth` key
3. Axios interceptor auto-attaches `Authorization: Bearer {token}` to all requests
4. 401 response triggers `auth-logout` event, clears localStorage

### Question Flow
1. `/questions` mounts -> `useQuestions().fetchQuestions({ sort, tag, page })` -> `GET /questions`
2. Response normalized via `normalizeQuestion()` -> displayed in `<QuestionList>`
3. User clicks question -> `/questions/[slug]` -> `fetchBySlug(slug)` + `useAnswers().fetchAnswers(slug)`
4. Voting: `<VoteWidget>` -> `useVotes().vote("question", id, 1|-1)` -> `POST /votes`
5. Answering: `<AnswerForm>` -> `useAnswers().createAnswer(slug, { body })` -> `POST /questions/:slug/answers`
6. Accepting: `<AcceptAnswerButton>` -> `useAnswers().acceptAnswer(id)` -> `POST /answers/:id/accept`

### Discussion Flow
1. `/discussions` mounts -> `useDiscussions().fetchDiscussions({ category })` -> `GET /discussions`
2. Response normalized via `normalizeDiscussion()` -> displayed in `<DiscussionList>`
3. User clicks -> `/discussions/[slug]` -> `fetchBySlug(slug)` + `fetchReplies(slug)`
4. Replies: flat array normalized via `normalizeReply()`, then `buildThreadTree()` builds nested structure
5. Replying: `<ReplyForm>` -> `createReply(slug, { body, parent_id })` -> `POST /discussions/:slug/replies`

### AI Assistant Flow
1. `/ai-assistant` mounts -> `useRag().getConversations()` -> `GET /rag/conversations` -> sidebar populated
2. User types question -> `useRag().ask(question, conversationId)` -> `POST /rag/ask`
3. Response: `{ answer, sources: [...], conversation_id }` -> new ChatMessage added, SourceCards displayed
4. Previous conversation loaded: `getConversation(id)` -> `GET /rag/conversations/:id`

### Notification Flow
1. Layout mounts -> `NotificationBell` component -> `useNotifications().fetchUnreadCount()` -> `notificationStore.setUnreadCount(count)`
2. Poll every 60s (or WebSocket later) for unread count
3. Click bell -> dropdown shows recent notifications via `fetchNotifications({ limit: 10 })`
4. Click notification -> `markRead(id)` + navigate to entity

---

## 13. FILE CREATION ORDER (Recommended)

Phase 1 — Foundation (shared components, stores, hooks, constants):
1. `lib/constants.js` (modify)
2. `lib/normalizers.js` (modify)
3. `lib/utils.js` (modify)
4. `lib/endpoints.js` (modify)
5. `stores/authStore.js` (modify)
6. `stores/notificationStore.js` (new)
7. `hooks/useQuestions.js` (new)
8. `hooks/useAnswers.js` (new)
9. `hooks/useVotes.js` (new)
10. `hooks/useDiscussions.js` (new)
11. `hooks/useSearch.js` (new)
12. `hooks/useNotifications.js` (new)
13. `hooks/useRag.js` (new)

Phase 2 — Shared components:
14. `components/shared/EmptyState.jsx`
15. `components/shared/TagBadge.jsx`
16. `components/shared/ContentTabs.jsx`
17. `components/shared/VoteWidget.jsx`
18. `components/shared/ReputationBadge.jsx`
19. `components/shared/InfiniteScrollWrapper.jsx`
20. `components/shared/UserMiniCard.jsx`
21. `components/shared/ContentEditor.jsx`

Phase 3 — Questions:
22. `components/questions/VoteButtons.jsx`
23. `components/questions/AcceptAnswerButton.jsx`
24. `components/questions/QuestionCard.jsx`
25. `components/questions/QuestionList.jsx`
26. `components/questions/AnswerCard.jsx`
27. `components/questions/AnswerForm.jsx`
28. `components/questions/AnswerList.jsx`
29. `components/questions/QuestionDetail.jsx`
30. `app/questions/page.jsx`
31. `app/questions/ask/page.jsx`
32. `app/questions/[slug]/page.jsx`

Phase 4 — Discussions:
33. `components/discussions/CategoryBadge.jsx`
34. `components/discussions/DiscussionCard.jsx`
35. `components/discussions/DiscussionList.jsx`
36. `components/discussions/ReplyCard.jsx`
37. `components/discussions/ReplyForm.jsx`
38. `components/discussions/DiscussionDetail.jsx`
39. `app/discussions/page.jsx`
40. `app/discussions/new/page.jsx`
41. `app/discussions/[slug]/page.jsx`

Phase 5 — AI Assistant:
42. `components/ai/ChatMessage.jsx`
43. `components/ai/ChatInput.jsx`
44. `components/ai/SourceCard.jsx`
45. `components/ai/ConversationSidebar.jsx`
46. `components/ai/ChatInterface.jsx`
47. `app/ai-assistant/page.jsx`

Phase 6 — Tags, Leaderboard, Settings, Search:
48. `components/tags/TagGrid.jsx`
49. `components/tags/TagDetailContent.jsx`
50. `app/tags/page.jsx`
51. `app/tags/[slug]/page.jsx`
52. `components/leaderboard/LeaderboardTable.jsx`
53. `app/leaderboard/page.jsx`
54. `components/settings/SettingsLayout.jsx`
55. `components/settings/ProfileSettings.jsx`
56. `components/settings/NotificationSettings.jsx`
57. `components/settings/AccountSettings.jsx`
58. `app/settings/page.jsx`
59. `components/search/UnifiedSearchResults.jsx`
60. `app/search/page.jsx` (modify)

Phase 7 — Layout updates and home page:
61. `components/layout/NotificationBell.jsx`
62. `components/layout/Navbar.jsx` (modify)
63. `components/home/QuestionFeed.jsx`
64. `components/home/DiscussionFeed.jsx`
65. `components/home/Hero.jsx` (modify)
66. `app/page.jsx` (modify)
67. `components/profile/ProfileQuestions.jsx`
68. `components/profile/ProfileAnswers.jsx`
69. `components/profile/ProfileBadges.jsx`
70. `components/profile/ProfilePageContent.jsx` (modify)
71. `app/user/[username]/page.jsx` (modify)
72. `app/globals.css` (modify)
