// Safely extract data from API response (handles both formats)
// API returns: { success, data: { posts, pagination } } or { success, data: [...] }
export function extractList(res, key = 'posts') {
  if (!res) return [];
  const data = res.data ?? res;
  if (Array.isArray(data)) return data;
  if (data?.[key] && Array.isArray(data[key])) return data[key];
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export function extractPagination(res) {
  if (!res) return null;
  const data = res.data ?? res;
  return data?.pagination || null;
}

export function normalizePost(apiPost) {
  if (!apiPost) return null;
  return {
    id: apiPost.id,
    slug: apiPost.slug,
    title: apiPost.title,
    excerpt: apiPost.excerpt,
    coverImage: apiPost.cover_image,
    content: apiPost.content,
    readTime: apiPost.read_time,
    likes: apiPost.likes_count || 0,
    comments: apiPost.comments_count || 0,
    views: apiPost.views_count || 0,
    publishedAt: apiPost.published_at,
    createdAt: apiPost.created_at,
    featured: !!apiPost.featured,
    isLiked: apiPost.isLiked || false,
    isBookmarked: apiPost.isBookmarked || false,
    status: apiPost.status,
    author: {
      id: apiPost.author_id,
      name: apiPost.author_name,
      username: apiPost.author_username,
      avatar: apiPost.author_avatar,
    },
    tags: apiPost.tags || [],
  };
}

export function normalizeComment(apiComment) {
  if (!apiComment) return null;
  return {
    id: apiComment.id,
    content: apiComment.content,
    likes: apiComment.likes_count || 0,
    parentId: apiComment.parent_id,
    createdAt: apiComment.created_at,
    author: {
      name: apiComment.author_name,
      username: apiComment.author_username,
      avatar: apiComment.author_avatar,
    },
  };
}

export function normalizeUser(apiUser) {
  if (!apiUser) return null;
  return {
    id: apiUser.id,
    name: apiUser.name,
    username: apiUser.username,
    email: apiUser.email,
    avatar: apiUser.avatar,
    bio: apiUser.bio,
    location: apiUser.location,
    website: apiUser.website,
    twitter: apiUser.twitter,
    github: apiUser.github,
    role: apiUser.role,
    plan: apiUser.plan,
    followers: apiUser.followers_count || 0,
    following: apiUser.following_count || 0,
    postsCount: apiUser.postsCount || 0,
    isFollowing: apiUser.isFollowing || false,
    joinedDate: apiUser.created_at,
  };
}
