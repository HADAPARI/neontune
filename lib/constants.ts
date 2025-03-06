export const COLORS = {
  ELECTRIC_BLUE: '#00FFFF',
  NEON_PINK: '#FF007F',
  DEEP_BLACK: '#0A0A0A',
  NEON_PURPLE: '#8D00FF',
} as const;

export const SITE_CONFIG = {
  name: 'NeonTune',
  description: 'Application de streaming musical gratuite et sans publicité',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og.jpg',
  author: 'NeonTune Team',
  links: {
    github: 'https://github.com/yourusername/neontune',
  },
} as const;

export const API_ENDPOINTS = {
  YOUTUBE_SEARCH: '/api/youtube/search',
  YOUTUBE_STREAM: '/api/youtube/stream',
  CONTACT: '/api/contact',
} as const;

export const SEARCH_CONFIG = {
  MAX_RESULTS: 50,
  SCROLL_THRESHOLD: 0.8,
} as const; 