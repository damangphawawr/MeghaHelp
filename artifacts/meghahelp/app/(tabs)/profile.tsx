import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useWorkers } from '@/context/WorkersContext';
import { Avatar } from '@/components/Avatar';
import { WorkerCard } from '@/components/WorkerCard';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { getUserWorker } = useWorkers();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const userWorker = user ? getUserWorker(user.uid) : undefined;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await signOut();
          },
        },
      ]
    );
  };

  // ── Guest view ───────────────────────────────────────────────────────────
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.guestHeader, { paddingTop: topPad + 24, backgroundColor: colors.card }]}>
          <View style={[styles.guestIconWrap, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="person-outline" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.guestTitle, { color: colors.foreground }]}>Your Profile</Text>
          <Text style={[styles.guestSub, { color: colors.mutedForeground }]}>
            Sign in to unlock all features
          </Text>
        </View>

        <View style={styles.benefitsList}>
          {[
            { icon: 'call-outline', text: 'View worker phone numbers & WhatsApp' },
            { icon: 'star-outline', text: 'Rate and review workers' },
            { icon: 'briefcase-outline', text: 'Register as a worker and get hired' },
            { icon: 'notifications-outline', text: 'Get notifications for new workers' },
          ].map((b, i) => (
            <View key={i} style={[styles.benefit, { borderBottomColor: colors.border }]}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '12' }]}>
                <Ionicons name={b.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{b.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity
            style={[styles.signInBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth/login')}
          >
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.signInBtnText}>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={[styles.browsing, { color: colors.mutedForeground }]}>
            Browsing as guest — sign in to contact workers
          </Text>
        </View>
      </View>
    );
  }

  // ── Logged-in view ───────────────────────────────────────────────────────
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* User card */}
      <View style={[styles.userCard, { paddingTop: topPad + 16, backgroundColor: colors.card }]}>
        <Avatar name={user.name} photo={user.photo} size={72} />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{user.email}</Text>
          {user.district && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color={colors.mutedForeground} />
              <Text style={[styles.userLocation, { color: colors.mutedForeground }]}>
                {[user.town, user.district].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick actions */}
      <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
        {[
          { icon: 'person-outline', label: 'Edit Profile', onPress: () => router.push('/auth/onboarding') },
          { icon: 'shield-checkmark-outline', label: 'Account Security', onPress: () => {} },
          { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
        ].map((a, i, arr) => (
          <TouchableOpacity
            key={a.label}
            style={[styles.actionRow, { borderBottomColor: colors.border, borderBottomWidth: i < arr.length - 1 ? StyleSheet.hairlineWidth : 0 }]}
            onPress={a.onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + '12' }]}>
              <Ionicons name={a.icon as any} size={18} color={colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Worker profile */}
      {userWorker ? (
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Worker Profile</Text>
          <WorkerCard worker={userWorker} onPress={() => router.push(`/worker/${userWorker.id}`)} />
        </View>
      ) : (
        <View style={styles.sectionBlock}>
          <View style={[styles.becomeWorkerCard, { backgroundColor: colors.primary + '0D', borderColor: colors.primary + '30' }]}>
            <Ionicons name="briefcase-outline" size={28} color={colors.primary} />
            <Text style={[styles.becomeTitle, { color: colors.primary }]}>Offer Your Services</Text>
            <Text style={[styles.becomeDesc, { color: colors.mutedForeground }]}>
              Register as a worker and get discovered by thousands of people looking for your skills.
            </Text>
            <TouchableOpacity
              style={[styles.becomeBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.becomeBtnText}>Register as Worker</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Sign out */}
      <View style={styles.sectionBlock}>
        <TouchableOpacity
          style={[styles.signOutBtn, { borderColor: colors.border }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  guestHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 10,
  },
  guestIconWrap: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  guestTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  guestSub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  benefitsList: { paddingHorizontal: 24, marginTop: 8 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  benefitIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  authButtons: { padding: 24, gap: 12 },
  signInBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14 },
  signInBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  browsing: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular' },
  userCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  userInfo: { flex: 1, gap: 3 },
  userName: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  userEmail: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  userLocation: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  actionsCard: { marginTop: 16, marginHorizontal: 16, borderRadius: 16, paddingHorizontal: 16, overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  actionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  sectionBlock: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  becomeWorkerCard: { borderRadius: 16, padding: 20, borderWidth: 1, alignItems: 'center', gap: 8 },
  becomeTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  becomeDesc: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
  becomeBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  becomeBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  signOutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
