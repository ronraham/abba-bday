import { useState, useEffect, useCallback } from 'react';
import type { Song, CreateSongInput } from '../types';
import { storageService } from '../services/storage';

export function usePlaylist() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load songs on mount
  const loadSongs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storageService.getSongs();
      setSongs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  // Add a new song
  const addSong = useCallback(async (song: CreateSongInput) => {
    try {
      setError(null);
      const newSong = await storageService.addSong(song);
      setSongs((prev) => [newSong, ...prev]); // Add to beginning for newest first
      return newSong;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add song';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Delete a song (admin only)
  const deleteSong = useCallback(async (id: string) => {
    try {
      setError(null);
      await storageService.deleteSong(id);
      setSongs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete song';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    songs,
    loading,
    error,
    addSong,
    deleteSong,
    refreshPlaylist: loadSongs,
  };
}
