import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, APP_CONFIG } from '../utils/constants';

interface AuthSession {
  isAuthenticated: boolean;
  expiresAt: number;
}

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if there's an existing valid session
  const checkSession = useCallback(() => {
    try {
      const sessionData = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (sessionData) {
        const session: AuthSession = JSON.parse(sessionData);
        if (session.expiresAt > Date.now()) {
          setIsAdmin(true);
          return true;
        } else {
          // Session expired, clear it
          localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
        }
      }
    } catch (err) {
      console.error('Error checking auth session:', err);
    }
    setIsAdmin(false);
    return false;
  }, []);

  useEffect(() => {
    checkSession();
    setLoading(false);
  }, [checkSession]);

  // Login with password
  const login = useCallback((password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('Admin password not configured');
      return false;
    }

    if (password === adminPassword) {
      const session: AuthSession = {
        isAuthenticated: true,
        expiresAt: Date.now() + APP_CONFIG.ADMIN_SESSION_DURATION,
      };
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(session));
      setIsAdmin(true);
      return true;
    }

    return false;
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setIsAdmin(false);
  }, []);

  return {
    isAdmin,
    loading,
    login,
    logout,
    checkSession,
  };
}
