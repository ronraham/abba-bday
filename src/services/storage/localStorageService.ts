import type {
  StorageService,
  RSVP,
  CreateRSVPInput,
  UpdateRSVPInput,
  Song,
  CreateSongInput
} from '../../types';
import { generateId, getCurrentTimestamp } from '../../utils/helpers';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * localStorage implementation of the StorageService interface
 * This can be easily swapped with a Supabase implementation later
 */
class LocalStorageService implements StorageService {
  // RSVP Methods
  async getRSVPs(): Promise<RSVP[]> {
    const data = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing RSVPs from localStorage:', error);
      return [];
    }
  }

  async addRSVP(rsvp: CreateRSVPInput): Promise<RSVP> {
    const rsvps = await this.getRSVPs();

    // Check if name already exists
    const existingRSVP = rsvps.find(
      (r) => r.name.toLowerCase() === rsvp.name.toLowerCase()
    );

    if (existingRSVP) {
      throw new Error('An RSVP with this name already exists');
    }

    const newRSVP: RSVP = {
      ...rsvp,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
    };

    rsvps.push(newRSVP);
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));

    return newRSVP;
  }

  async updateRSVP(id: string, updates: UpdateRSVPInput): Promise<RSVP> {
    const rsvps = await this.getRSVPs();
    const index = rsvps.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error('RSVP not found');
    }

    // If updating name, check for duplicates
    if (updates.name) {
      const duplicate = rsvps.find(
        (r) => r.id !== id && r.name.toLowerCase() === updates.name!.toLowerCase()
      );
      if (duplicate) {
        throw new Error('An RSVP with this name already exists');
      }
    }

    const updatedRSVP: RSVP = {
      ...rsvps[index],
      ...updates,
    };

    rsvps[index] = updatedRSVP;
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));

    return updatedRSVP;
  }

  async deleteRSVP(id: string): Promise<void> {
    const rsvps = await this.getRSVPs();
    const filtered = rsvps.filter((r) => r.id !== id);

    if (filtered.length === rsvps.length) {
      throw new Error('RSVP not found');
    }

    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(filtered));
  }

  async getRSVPByName(name: string): Promise<RSVP | null> {
    const rsvps = await this.getRSVPs();
    return rsvps.find((r) => r.name.toLowerCase() === name.toLowerCase()) || null;
  }

  // Playlist Methods
  async getSongs(): Promise<Song[]> {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYLIST);
    if (!data) return [];
    try {
      const songs = JSON.parse(data);
      // Sort by creation date, newest first
      return songs.sort((a: Song, b: Song) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error parsing songs from localStorage:', error);
      return [];
    }
  }

  async addSong(song: CreateSongInput): Promise<Song> {
    const songs = await this.getSongs();

    const newSong: Song = {
      ...song,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
    };

    songs.push(newSong);
    localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(songs));

    return newSong;
  }

  async deleteSong(id: string): Promise<void> {
    const songs = await this.getSongs();
    const filtered = songs.filter((s) => s.id !== id);

    if (filtered.length === songs.length) {
      throw new Error('Song not found');
    }

    localStorage.setItem(STORAGE_KEYS.PLAYLIST, JSON.stringify(filtered));
  }
}

// Export a singleton instance
export const storageService = new LocalStorageService();
