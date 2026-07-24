import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signInWithGoogle, isAuthenticating, authError, needsOnboarding } = useAuth();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleGoogleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signInWithGoogle();
  };

  const handleGuest = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Close button */}
      <TouchableOpacity
        style={[styles.closeBtn, { top: topPad + 12, backgroundColor: colors.muted }]}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={20} color={colors.foreground} />
      </TouchableOpacity>

      {/* Branding */}
      <View style={[styles.hero, { paddingTop: topPad + 80 }]}>
        <View style={[styles.logoWrap, { backgroundColor: colors.primary + '18' }]}>
          <Ionicons name="people-outline" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.primary }]}>MeghaHelp</Text>
        <Text style={[styles.headline, { color: colors.foreground }]}>
          Connect with trusted workers in Meghalaya
        </Text>
        <Text style={[styles.subtext, { color: colors.mutedForeground }]}>
          Sign in to view contact details, leave reviews, and register as a worker.
        </Text>
      </View>

      {/* Benefit chips */}
      <View style={styles.chips}>
        {['View phone numbers', 'Rate workers', 'Get hired'].map(chip => (
          <View key={chip} style={[styles.chip, { backgroundColor: colors.primary + '12' }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            <Text style={[styles.chipText, { color: colors.primary }]}>{chip}</Text>
          </View>
        ))}
      </View>

      {/* Auth buttons */}
      <View style={[styles.actions, { paddingBottom: bottomPad + 24 }]}>
        {authError && (
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {authError}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.googleBtn, { backgroundColor: colors.primary, opacity: isAuthenticating ? 0.7 : 1 }]}
          onPress={handleGoogleSignIn}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="logo-google" size={22} color="#fff" />
          )}
          <Text style={styles.googleBtnText}>
            {isAuthenticating ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
          <Text style={[styles.guestText, { color: colors.mutedForeground }]}>
            Browse as guest
          </Text>
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeBtn: {
    position: 'absolute', right: 16, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  hero: {
    flex: 1, alignItems: 'center', paddingHorizontal: 32, gap: 14,
  },
  logoWrap: {
    width: 96, height: 96, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  appName: { fontSize: 32, fontFamily: 'Inter_700Bold' },
  headline: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center', lineHeight: 28 },
  subtext: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 21 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, paddingHorizontal: 24, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  actions: { paddingHorizontal: 24, gap: 14 },
  errorText: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 19 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12, paddingVertical: 16, borderRadius: 16,
  },
  googleBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  guestBtn: { alignItems: 'center', paddingVertical: 8 },
  guestText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  disclaimer: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 17 },
});