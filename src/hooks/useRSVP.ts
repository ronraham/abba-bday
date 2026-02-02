import { useState, useEffect, useCallback } from 'react';
import type { RSVP, CreateRSVPInput } from '../types';
import { storageService } from '../services/storage';

export function useRSVP() {
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load RSVPs on mount
  const loadRSVPs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storageService.getRSVPs();
      setRSVPs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRSVPs();
  }, [loadRSVPs]);

  // Add a new RSVP
  const addRSVP = useCallback(async (rsvp: CreateRSVPInput) => {
    try {
      setError(null);
      const newRSVP = await storageService.addRSVP(rsvp);
      setRSVPs((prev) => [...prev, newRSVP]);
      return newRSVP;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add RSVP';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Check if name exists
  const checkNameExists = useCallback(async (name: string): Promise<boolean> => {
    try {
      const existing = await storageService.getRSVPByName(name);
      return existing !== null;
    } catch (err) {
      return false;
    }
  }, []);

  // Delete an RSVP (admin only)
  const deleteRSVP = useCallback(async (id: string) => {
    try {
      setError(null);
      await storageService.deleteRSVP(id);
      setRSVPs((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete RSVP';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Update an RSVP (admin only)
  const updateRSVP = useCallback(async (id: string, updates: Partial<CreateRSVPInput>) => {
    try {
      setError(null);
      const updatedRSVP = await storageService.updateRSVP(id, updates);
      setRSVPs((prev) => prev.map((r) => (r.id === id ? updatedRSVP : r)));
      return updatedRSVP;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update RSVP';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Get total attending count
  const getAttendingCount = useCallback(() => {
    return rsvps
      .filter((r) => r.attending)
      .reduce((sum, r) => sum + r.partySize, 0);
  }, [rsvps]);

  return {
    rsvps,
    loading,
    error,
    addRSVP,
    deleteRSVP,
    updateRSVP,
    checkNameExists,
    getAttendingCount,
    refreshRSVPs: loadRSVPs,
  };
}
