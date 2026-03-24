import { getDefaultAvatar } from './utils';

function avatarOrDefault(avatar, seed) {
  return avatar || getDefaultAvatar(seed);
}

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
      avatar: avatarOrDefault(apiPost.author_avatar, apiPost.author_username),
    },
    tags: apiPost.tags || [],
  };
}

export function normalizeComment(apiComment) {
  if (!apiComment) return null;
  return {
    id: apiComment.id,
    content: apiComment.body || apiComment.content,
    likes: apiComment.likes_count || 0,
    parentId: apiComment.parent_id,
    createdAt: apiComment.created_at,
    author: {
      name: apiComment.author_name,
      username: apiComment.author_username,
      avatar: avatarOrDefault(apiComment.author_avatar, apiComment.author_username),
    },
  };
}

export function normalizeQuestion(q) {
  if (!q) return null;
  return {
    id: q.id, slug: q.slug, title: q.title, body: q.body,
    status: q.status, isAnswered: q.is_answered,
    acceptedAnswerId: q.accepted_answer_id,
    votes: q.votes_count || 0, answers: q.answers_count || 0,
    comments: q.comments_count || 0, views: q.views_count || 0,
    bounty: q.bounty || 0,
    createdAt: q.created_at, updatedAt: q.updated_at,
    userVote: q.userVote || null,
    author: { id: q.author_id, name: q.author_name, username: q.author_username, avatar: avatarOrDefault(q.author_avatar, q.author_username), reputation: q.author_reputation },
    tags: q.tags || [],
  };
}

export function normalizeAnswer(a) {
  if (!a) return null;
  return {
    id: a.id, body: a.body, isAccepted: a.is_accepted,
    votes: a.votes_count || 0, comments: a.comments_count || 0,
    createdAt: a.created_at, updatedAt: a.updated_at, userVote: a.userVote || null,
    author: { id: a.author_id, name: a.author_name, username: a.author_username, avatar: avatarOrDefault(a.author_avatar, a.author_username), reputation: a.author_reputation },
  };
}

export function normalizeDiscussion(d) {
  if (!d) return null;
  return {
    id: d.id, slug: d.slug, title: d.title, body: d.body,
    isPinned: d.is_pinned, isLocked: d.is_locked,
    replies: d.replies_count || 0, views: d.views_count || 0,
    lastActivityAt: d.last_activity_at, createdAt: d.created_at,
    categoryName: d.category_name, categoryColor: d.category_color,
    author: { id: d.author_id, name: d.author_name, username: d.author_username, avatar: avatarOrDefault(d.author_avatar, d.author_username) },
  };
}

export function normalizeNotification(n) {
  if (!n) return null;
  return {
    id: n.id, type: n.type, isRead: n.is_read, createdAt: n.created_at,
    targetType: n.target_type, targetId: n.target_id, data: n.data,
    actor: { name: n.actor_name, username: n.actor_username, avatar: avatarOrDefault(n.actor_avatar, n.actor_username) },
  };
}

export function normalizeUser(apiUser) {
  if (!apiUser) return null;
  return {
    id: apiUser.id,
    name: apiUser.name,
    username: apiUser.username,
    email: apiUser.email,
    avatar: avatarOrDefault(apiUser.avatar, apiUser.username),
    bio: apiUser.bio,
    location: apiUser.location,
    website: apiUser.website,
    twitter: apiUser.twitter,
    github: apiUser.github,
    role: apiUser.role,
    plan: apiUser.plan,
    followers: apiUser.followers_count || 0,
    following: apiUser.following_count || 0,
    postsCount: apiUser.posts_count || apiUser.postsCount || 0,
    isFollowing: apiUser.isFollowing || false,
    joinedDate: apiUser.created_at,
  };
}
