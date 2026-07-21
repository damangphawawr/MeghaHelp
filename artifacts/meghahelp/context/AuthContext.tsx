/**
 * AuthContext — manages user authentication state.
 * Currently uses a mock Google Sign-In for MVP.
 * To upgrade: replace signInWithGoogle() with Firebase Google Auth.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StorageService } from '@/services/storage';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  needsOnboarding: boolean;
  setNeedsOnboarding: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  needsOnboarding: false,
  setNeedsOnboarding: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    StorageService.getUser().then(savedUser => {
      setUser(savedUser);
      setIsLoading(false);
    });
  }, []);

  /**
   * Mock Google Sign-In.
   * In production: initialize Firebase, call signInWithPopup(googleProvider),
   * then persist the returned Firebase user to AsyncStorage.
   */
  const signInWithGoogle = useCallback(async () => {
    const mockUser: User = {
      uid: `user_${Date.now().toString(36)}`,
      name: 'Google User',
      email: 'user@gmail.com',
      photo: null,
      phone: null,
      district: null,
      town: null,
    };
    await StorageService.setUser(mockUser);
    setUser(mockUser);
    setNeedsOnboarding(true);
  }, []);

  const signOut = useCallback(async () => {
    await StorageService.clearUser();
    setUser(null);
    setNeedsOnboarding(false);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...updates };
    await StorageService.setUser(updated);
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, isLoading, signInWithGoogle, signOut,
      updateProfile, needsOnboarding, setNeedsOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
