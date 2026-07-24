import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { StorageService } from '@/services/storage';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  needsOnboarding: boolean;
  setNeedsOnboarding: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticating: false,
  authError: null,
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
  const processedUid = useRef<string | null>(null);

  const { signIn, googleUser, isAuthenticating, authError } = useGoogleAuth();

  // Load persisted user on mount
  useEffect(() => {
    StorageService.getUser().then(saved => {
      setUser(saved);
      setIsLoading(false);
    });
  }, []);

  // When Google auth returns a user, persist it
  useEffect(() => {
    if (googleUser && processedUid.current !== googleUser.uid) {
      processedUid.current = googleUser.uid;
      const newUser: User = {
        uid: googleUser.uid,
        name: googleUser.name,
        email: googleUser.email,
        photo: googleUser.photo,
        phone: null,
        district: null,
        town: null,
      };
      StorageService.setUser(newUser).then(() => {
        setUser(newUser);
        setNeedsOnboarding(true);
      });
    }
  }, [googleUser]);

  const signInWithGoogle = useCallback(async () => {
    await signIn();
  }, [signIn]);

  const signOut = useCallback(async () => {
    processedUid.current = null;
    await StorageService.clearUser();
    setUser(null);
    setNeedsOnboarding(false);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      StorageService.setUser(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticating, authError,
      signInWithGoogle, signOut,
      updateProfile, needsOnboarding, setNeedsOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}