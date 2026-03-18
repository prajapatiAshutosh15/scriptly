export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateString);
}

export function calculateReadTime(content) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatNumber(num) {
  if (num == null) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// Get a random default cover image based on a seed (post id/slug for consistency)
const TOTAL_COVERS = 10;
// Alias for backward compat
export const formatRelativeTime = getRelativeTime;

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || singular + 's');
}

export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}

export function getDefaultCover(seed) {
  if (!seed) {
    const index = Math.floor(Math.random() * TOTAL_COVERS) + 1;
    return `/images/covers/cover-${index}.jpg`;
  }
  // Use seed to always return the same image for the same post
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = (Math.abs(hash) % TOTAL_COVERS) + 1;
  return `/images/covers/cover-${index}.jpg`;
}
