import type { Link } from "../types";

export const SITE = {
  title: "AI 深度观察",
  // 副标题：洞察AI未来，解码智能世界
  tagline: "洞察AI未来，解码智能世界",
  description:
    "AI 深度观察（aideepseen.com）聚焦人工智能领域的前沿技术、行业动态与应用实践，通过专业分析与深度解读，为从业者、研究者和爱好者提供多维度的洞察视角。我们致力于挖掘AI技术的底层逻辑，探讨其对商业、社会和人类未来的深远影响，助您站在智能革命的最前沿。",
  author: "Mohammad Rahmani",
  url: "https://aideepseen.com",
  github: "https://github.com/Mrahmani71/astro-news",
  locale: "zh-CN",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
};

// 主导航：8 大栏目
export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/must-read",
    text: "今日必读",
  },
  {
    href: "/deep-watch",
    text: "深度观察",
  },
  {
    href: "/flash",
    text: "快讯",
  },
  {
    href: "/categories/tech-frontier",
    text: "技术前沿",
  },
  {
    href: "/categories/industry",
    text: "产业动态",
  },
  {
    href: "/categories/tools",
    text: "工具推荐",
  },
  {
    href: "/rankings",
    text: "榜单",
  },
  {
    href: "/newsletter",
    text: "Newsletter",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "About us",
  },
  {
    href: "/authors",
    text: "Authors",
  },
  {
    href: "/contact",
    text: "Contact",
  },
  {
    href: "/privacy",
    text: "Privacy",
  },
  {
    href: "/terms",
    text: "Terms",
  },
  {
    href: "/cookie-policy",
    text: "Cookie Policy",
  },
  {
    href: `${SITE.url}/rss.xml`,
    text: "RSS",
  },
  {
    href: `${SITE.url}/sitemap-index.xml`,
    text: "Sitemap",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://github.com",
    text: "GitHub",
    icon: "github",
  },
  {
    href: "httpe://www.t.me",
    text: "Telegram",
    icon: "telegram",
  },
  {
    href: "https://twitter.com",
    text: "Twitter",
    icon: "newTwitter",
  },
  {
    href: "https://www.facebook.com",
    text: "Facebook",
    icon: "facebook",
  },
];
