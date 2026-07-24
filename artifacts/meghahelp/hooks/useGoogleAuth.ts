import { useEffect, useCallback, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_CLIENT_ID, GOOGLE_DISCOVERY, GOOGLE_SCOPES } from '@/constants/googleAuth';

WebBrowser.maybeCompleteAuthSession();

interface GoogleUser {
  uid: string;
  name: string;
  email: string;
  photo: string | null;
}

function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useGoogleAuth() {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'meghahelp',
    path: 'auth/login',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: [...GOOGLE_SCOPES],
      responseType: 'id_token',
      extraParams: {
        access_type: 'online',
        prompt: 'select_account',
      },
    },
    GOOGLE_DISCOVERY
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const payload = parseJwt(id_token);
        if (payload) {
          setGoogleUser({
            uid: payload.sub,
            name: payload.name || payload.email?.split('@')[0] || 'Google User',
            email: payload.email || '',
            photo: payload.picture || null,
          });
        }
      }
      setIsAuthenticating(false);
    } else if (response?.type === 'error') {
      setAuthError(response.error?.description || 'Google sign-in failed');
      setIsAuthenticating(false);
    } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
      setIsAuthenticating(false);
    }
  }, [response]);

  const signIn = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setAuthError('Google Client ID not configured. Add EXPO_PUBLIC_GOOGLE_CLIENT_ID.');
      return;
    }
    setAuthError(null);
    setIsAuthenticating(true);
    await promptAsync();
  }, [promptAsync]);

  return { signIn, googleUser, isAuthenticating, authError };
}