/**
 * Google OAuth configuration.
 * Set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your .env and Vercel dashboard.
 */
export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
} as const;

export const GOOGLE_SCOPES = ['openid', 'profile', 'email'] as const;