import type {
  StorageService,
  RSVP,
  CreateRSVPInput,
  UpdateRSVPInput,
  Song,
  CreateSongInput
} from '../../types';

// Use Vercel serverless API endpoint
const API_URL = '/api/sheets';

/**
 * Google Sheets implementation of the StorageService interface
 * Uses Vercel serverless functions as a backend API
 */
class GoogleSheetsService implements StorageService {
  private async fetchGet(action: string, params: Record<string, string> = {}): Promise<unknown> {
    const url = new URL(API_URL, window.location.origin);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  }

  private async fetchPost(action: string, body: Record<string, unknown>): Promise<unknown> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...body }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  }

  // RSVP Methods
  async getRSVPs(): Promise<RSVP[]> {
    try {
      const data = await this.fetchGet('getRSVPs');
      return data as RSVP[];
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      throw error;
    }
  }

  async addRSVP(rsvp: CreateRSVPInput): Promise<RSVP> {
    try {
      const data = await this.fetchPost('addRSVP', { rsvp });
      return data as RSVP;
    } catch (error) {
      console.error('Error adding RSVP:', error);
      throw error;
    }
  }

  async updateRSVP(id: string, updates: UpdateRSVPInput): Promise<RSVP> {
    try {
      const data = await this.fetchPost('updateRSVP', { id, updates });
      return data as RSVP;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      throw error;
    }
  }

  async deleteRSVP(id: string): Promise<void> {
    try {
      await this.fetchPost('deleteRSVP', { id });
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      throw error;
    }
  }

  async getRSVPByName(name: string): Promise<RSVP | null> {
    try {
      const data = await this.fetchGet('getRSVPByName', { name });
      return data as RSVP | null;
    } catch (error) {
      console.error('Error fetching RSVP by name:', error);
      throw error;
    }
  }

  // Playlist Methods
  async getSongs(): Promise<Song[]> {
    try {
      const data = await this.fetchGet('getSongs');
      return data as Song[];
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  }

  async addSong(song: CreateSongInput): Promise<Song> {
    try {
      const data = await this.fetchPost('addSong', { song });
      return data as Song;
    } catch (error) {
      console.error('Error adding song:', error);
      throw error;
    }
  }

  async deleteSong(id: string): Promise<void> {
    try {
      await this.fetchPost('deleteSong', { id });
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const storageService = new GoogleSheetsService();
