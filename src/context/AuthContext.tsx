'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  fetchSession,
  signOut as authSignOut,
  signIn as authSignIn,
  signUp as authSignUp,
  type AuthUser,
} from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (data: { email: string; password: string }) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  signUp: (data: { name: string; email: string; phone?: string; password: string; otp: string }) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  signOut: () => void;
  refreshSession: () => Promise<AuthUser | null>;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session from verified server endpoint or client cache
  const refreshSession = useCallback(async () => {
    try {
      const serverUser = await fetchSession();
      if (serverUser) {
        setUser(serverUser);
        return serverUser;
      } else {
        // If server session returns null, clear client cache to ensure no stale data remains
        setUser(null);
        authSignOut();
        return null;
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial fast local cache check
    const local = getCurrentUser();
    if (local) {
      setUser(local);
    }

    // 2. Authoritative server verification
    refreshSession();

    // 3. Listen for cross-tab login/logout events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'atlasaura-user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshSession]);

  const signIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    const res = await authSignIn(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const signUp = async (data: { name: string; email: string; phone?: string; password: string; otp: string }) => {
    setIsLoading(true);
    const res = await authSignUp(data);
    if (res.success && res.user) {
      setUser(res.user);
    }
    setIsLoading(false);
    return res;
  };

  const signOut = () => {
    setUser(null);
    authSignOut();
  };

  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshSession,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
