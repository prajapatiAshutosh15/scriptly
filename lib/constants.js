export const SITE_NAME = "Scriptly";
export const SITE_DESCRIPTION = "Where developers write, share, and grow together";
export const SITE_URL = "https://scriptly.dev";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Questions", href: "/questions" },
  { label: "Discussions", href: "/discussions" },
  { label: "Explore", href: "/explore" },
  { label: "AI Assistant", href: "/ai-assistant" },
];

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
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

export const SIDEBAR_NAV = {
  general: [
    { label: "My Feed", href: "/", icon: "HomeOutlined" },
    { label: "Questions", href: "/questions", icon: "QuestionCircleOutlined" },
    { label: "Discussions", href: "/discussions", icon: "MessageOutlined" },
    { label: "Tags", href: "/tags", icon: "TagsOutlined" },
    { label: "Explore", href: "/explore", icon: "CompassOutlined" },
  ],
  you: [
    { label: "Bookmarks", href: "/bookmarks", icon: "BookOutlined" },
    { label: "Settings", href: "/settings", icon: "SettingOutlined" },
  ],
};

export const FEED_TABS = [
  { key: "following", label: "Following", sort: "feed" },
  { key: "featured", label: "Featured", sort: "popular" },
  { key: "rising", label: "Rising", sort: "latest" },
];

export const COLORS = {
  accent: "#d4a017",
  accentHover: "#e5b000",
  bgPrimary: "#0d1117",
  bgSurface: "#161b22",
  bgSurfaceHover: "#1c2333",
  textPrimary: "#e6edf3",
  textSecondary: "#8b949e",
  border: "#21262d",
  linkBlue: "#58a6ff",
  success: "#238636",
  danger: "#da3633",
};
