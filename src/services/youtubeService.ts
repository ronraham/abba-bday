import type { YouTubeSearchResult, YouTubeVideoDetails } from '../types';
import { YOUTUBE_API } from '../utils/constants';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * YouTube Data API v3 Service
 */
class YouTubeService {
  /**
   * Search for videos on YouTube
   */
  async searchVideos(query: string): Promise<YouTubeSearchResult[]> {
    if (!API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: String(YOUTUBE_API.MAX_RESULTS),
        key: API_KEY,
        videoCategoryId: '10', // Music category
      });

      const response = await fetch(
        `${YOUTUBE_API.BASE_URL}/search?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to search YouTube');
      }

      const data = await response.json();

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific video
   */
  async getVideoDetails(videoId: string): Promise<YouTubeVideoDetails> {
    if (!API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails',
        id: videoId,
        key: API_KEY,
      });

      const response = await fetch(
        `${YOUTUBE_API.BASE_URL}/videos?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch video details');
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found');
      }

      const item = data.items[0];

      return {
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        description: item.snippet.description,
      };
    } catch (error) {
      console.error('YouTube video details error:', error);
      throw error;
    }
  }

  /**
   * Get embed URL for a video
   */
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  /**
   * Get watch URL for a video
   */
  getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}

// Export singleton instance
export const youtubeService = new YouTubeService();
