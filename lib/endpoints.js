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
  POST_BOOKMARK: (slug) => `${API}/posts/${slug}/bookmark`,
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

  // Health
  HEALTH: `${API}/health`,
};
