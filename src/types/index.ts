// RSVP Types
export interface RSVP {
  id: string;
  name: string;
  partySize: number;
  attending: boolean;
  notes?: string;
  createdAt: string;
}

export type CreateRSVPInput = Omit<RSVP, 'id' | 'createdAt'>;
export type UpdateRSVPInput = Partial<Omit<RSVP, 'id' | 'createdAt'>>;

// Song/Playlist Types
export interface Song {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  dedicatedBy: string;
  dedicationMessage: string; // Private - visible only to admin
  happyBirthdayWords: string; // Public message
  createdAt: string;
}

export type CreateSongInput = Omit<Song, 'id' | 'createdAt'>;

// YouTube API Types
export interface YouTubeSearchResult {
  id: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  description: string;
}

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  description: string;
}

// Storage Service Interface
export interface StorageService {
  // RSVP methods
  getRSVPs(): Promise<RSVP[]>;
  addRSVP(rsvp: CreateRSVPInput): Promise<RSVP>;
  updateRSVP(id: string, updates: UpdateRSVPInput): Promise<RSVP>;
  deleteRSVP(id: string): Promise<void>;
  getRSVPByName(name: string): Promise<RSVP | null>;

  // Playlist methods
  getSongs(): Promise<Song[]>;
  addSong(song: CreateSongInput): Promise<Song>;
  deleteSong(id: string): Promise<void>;
}
