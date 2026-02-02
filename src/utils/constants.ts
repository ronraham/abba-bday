// Local storage keys
export const STORAGE_KEYS = {
  RSVPS: 'oren-bday-rsvps',
  PLAYLIST: 'oren-bday-playlist',
  ADMIN_AUTH: 'oren-bday-admin-auth',
} as const;

// YouTube API configuration
export const YOUTUBE_API = {
  BASE_URL: 'https://www.googleapis.com/youtube/v3',
  MAX_RESULTS: 10,
} as const;

// App configuration
export const APP_CONFIG = {
  PARTY_DATE: '28-02-2026',
  PARTY_TIME: '16:00',
  HONOREE_NAME: 'Oren Glanz',
  ADMIN_SESSION_DURATION: 3600000, // 1 hour in milliseconds
} as const;
