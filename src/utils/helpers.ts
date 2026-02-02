/**
 * Generate a unique ID (simple UUID v4 implementation)
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Extract artist name from YouTube video title
 * Handles various patterns: "Artist - Song", "Song | Artist", "Artist: Song", etc.
 */
export function extractArtistFromTitle(title: string, channelTitle?: string): string {
  // Remove common YouTube suffixes
  const cleanedTitle = title
    .replace(/\(official.*?\)/gi, '')
    .replace(/\[official.*?\]/gi, '')
    .replace(/\(lyrics?\)/gi, '')
    .replace(/\[lyrics?\]/gi, '')
    .replace(/\(audio\)/gi, '')
    .replace(/\[audio\]/gi, '')
    .replace(/\(music video\)/gi, '')
    .replace(/\[music video\]/gi, '')
    .trim();

  // Try different separators in order of likelihood
  const separators = [' - ', ' | ', ': ', ' – '];

  for (const separator of separators) {
    if (cleanedTitle.includes(separator)) {
      const parts = cleanedTitle.split(separator);
      if (parts.length >= 2) {
        const first = parts[0].trim();
        const second = parts[1].trim();

        // First part is usually the artist if it's reasonably short
        if (first.length > 0 && first.length <= 50) {
          return first;
        }
        // Otherwise try second part
        if (second.length > 0 && second.length <= 50) {
          return second;
        }
      }
    }
  }

  // Fallback to channel title if provided
  if (channelTitle && channelTitle !== 'Various Artists' && !channelTitle.includes('VEVO')) {
    return channelTitle;
  }

  return 'Unknown Artist';
}

/**
 * Extract video ID from YouTube URL
 * Supports various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  // Clean up the URL
  const cleanUrl = url.trim();

  // Pattern 1: youtube.com/watch?v=VIDEO_ID
  const watchPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const watchMatch = cleanUrl.match(watchPattern);
  if (watchMatch) {
    return watchMatch[1];
  }

  // Pattern 2: youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const shortMatch = cleanUrl.match(shortPattern);
  if (shortMatch) {
    return shortMatch[1];
  }

  // Pattern 3: youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const embedMatch = cleanUrl.match(embedPattern);
  if (embedMatch) {
    return embedMatch[1];
  }

  // Pattern 4: youtube.com/v/VIDEO_ID
  const vPattern = /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
  const vMatch = cleanUrl.match(vPattern);
  if (vMatch) {
    return vMatch[1];
  }

  // If it's just a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}
