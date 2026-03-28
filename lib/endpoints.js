const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API}/auth/login`,
  AUTH_REGISTER: `${API}/auth/register`,
  AUTH_ME: `${API}/auth/me`,

  // Posts
  POSTS: `${API}/posts`,
  POSTS_SEARCH: `${API}/posts/search`,
  POSTS_DRAFTS: `${API}/posts/drafts`,
  POSTS_FEED: `${API}/posts/feed`,
  POST_BY_SLUG: (slug) => `${API}/posts/${slug}`,
  POST_LIKE: (slug) => `${API}/posts/${slug}/like`,
  POST_BOOKMARK: (type, id) => `${API}/bookmarks/${type}/${id}`,
  POST_VIEWS: (slug) => `${API}/posts/${slug}/views`,

  // Users
  USER_PROFILE: (username) => `${API}/users/${username}`,
  USER_FOLLOW: (username) => `${API}/users/${username}/follow`,

  // Comments
  COMMENTS_BY_POST: (slug) => `${API}/comments/post/${slug}`,
  COMMENT_BY_ID: (id) => `${API}/comments/${id}`,
  COMMENT_LIKE: (id) => `${API}/comments/${id}/like`,

  // Tags
  TAGS: `${API}/tags`,
  TAG_BY_SLUG: (slug) => `${API}/tags/${slug}`,
  TAG_POSTS: (slug) => `${API}/tags/${slug}/posts`,

  // Bookmarks
  BOOKMARKS: `${API}/bookmarks`,

  // Notifications
  NOTIFICATIONS: `${API}/notifications`,
  NOTIFICATIONS_UNREAD: `${API}/notifications/unread-count`,

  // Uploads
  UPLOADS: `${API}/uploads`,

  // Questions
  QUESTIONS: `${API}/questions`,
  QUESTIONS_UNANSWERED: `${API}/questions/unanswered`,
  QUESTION_BY_SLUG: (slug) => `${API}/questions/${slug}`,

  // Answers
  ANSWERS_FOR_QUESTION: (questionId) => `${API}/answers/question/${questionId}`,
  ANSWER_BY_ID: (id) => `${API}/answers/${id}`,
  ANSWER_ACCEPT: (id) => `${API}/answers/${id}/accept`,

  // Votes
  VOTE: (type, id) => `${API}/votes/${type}/${id}`,

  // Discussions
  DISCUSSION_CATEGORIES: `${API}/discussions/categories`,
  DISCUSSIONS: `${API}/discussions`,
  DISCUSSION_BY_SLUG: (slug) => `${API}/discussions/${slug}`,
  DISCUSSION_REPLIES: (slug) => `${API}/discussions/${slug}/replies`,

  // Search (unified)
  SEARCH: `${API}/search`,
  SEARCH_SMART: `${API}/search/smart`,

  // RAG / AI
  RAG_ASK: `${API}/rag/ask`,
  RAG_CONVERSATIONS: `${API}/rag/conversations`,
  RAG_CONVERSATION: (id) => `${API}/rag/conversations/${id}`,

  // Tags (extended)
  TAGS_TRENDING: `${API}/tags/trending`,
  TAG_FOLLOW: (slug) => `${API}/tags/${slug}/follow`,

  // Users (extended)
  USER_POSTS: (username) => `${API}/users/${username}/posts`,
  USER_QUESTIONS: (username) => `${API}/users/${username}/questions`,
  USER_ANSWERS: (username) => `${API}/users/${username}/answers`,

  // Bookmarks (polymorphic)
  BOOKMARK: (type, id) => `${API}/bookmarks/${type}/${id}`,

  // Admin
  ADMIN_STATS: `${API}/admin/stats`,

  // Health
  HEALTH: `${API}/health`,
};
