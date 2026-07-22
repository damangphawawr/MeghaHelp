import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { shadow } from '@/utils/shadow';
import { useWorkers } from '@/context/WorkersContext';
import { useAuth } from '@/context/AuthContext';
import { WorkerCard } from '@/components/WorkerCard';
import { CategoryCard } from '@/components/CategoryCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { SearchBar } from '@/components/SearchBar';
import { SERVICE_CATEGORIES } from '@/constants/categories';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workers, isLoading, refreshWorkers } = useWorkers();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const approvedWorkers = useMemo(() =>
    workers.filter(w => w.isApproved), [workers]);

  const featuredWorkers = useMemo(() =>
    approvedWorkers.filter(w => w.rating >= 4.7).slice(0, 8), [approvedWorkers]);

  const displayedWorkers = useMemo(() => {
    if (!selectedCategoryId) return approvedWorkers.slice(0, 12);
    const cat = SERVICE_CATEGORIES.find(c => c.id === selectedCategoryId);
    if (!cat) return approvedWorkers.slice(0, 12);
    return approvedWorkers.filter(w => cat.professions.includes(w.profession));
  }, [approvedWorkers, selectedCategoryId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWorkers();
    setRefreshing(false);
  };

  const handleCategoryPress = (id: string) =>
    setSelectedCategoryId(prev => prev === id ? null : id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 14, backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {user ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome to'}
            </Text>
            <Text style={[styles.appName, { color: colors.primary }]}>MeghaHelp</Text>
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
              Find trusted help near you
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.profileBtn, { backgroundColor: colors.primary + '18' }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="person-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 14 }}>
          <SearchBar
            value=""
            onChangeText={() => {}}
            onPress={() => router.push('/(tabs)/search')}
          />
        </View>
      </View>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Browse by Category
          </Text>
          {selectedCategoryId && (
            <TouchableOpacity onPress={() => setSelectedCategoryId(null)}>
              <Text style={[styles.clearBtn, { color: colors.primary }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {SERVICE_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selectedCategoryId === cat.id}
              onPress={() => handleCategoryPress(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Top Rated (hidden when category selected) ───────────────────── */}
      {!selectedCategoryId && featuredWorkers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Rated</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={[styles.clearBtn, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredWorkers.map(worker => {
              const initials = worker.fullName
                .split(' ').filter(Boolean).slice(0, 2)
                .map(n => n[0]).join('').toUpperCase();
              return (
                <TouchableOpacity
                  key={worker.id}
                  style={[styles.featuredCard, { backgroundColor: colors.card }]}
                  onPress={() => router.push(`/worker/${worker.id}`)}
                  activeOpacity={0.82}
                >
                  <View style={[styles.featuredAvatar, { backgroundColor: colors.primary + '18' }]}>
                    <Text style={[styles.featuredInitials, { color: colors.primary }]}>
                      {initials}
                    </Text>
                  </View>
                  <Text style={[styles.featuredName, { color: colors.foreground }]} numberOfLines={1}>
                    {worker.fullName.split(' ').pop()}
                  </Text>
                  <Text style={[styles.featuredProf, { color: colors.primary }]} numberOfLines={1}>
                    {worker.customProfession ?? worker.profession}
                  </Text>
                  <View style={styles.featuredRatingRow}>
                    <Ionicons name="star" size={11} color={colors.accent} />
                    <Text style={[styles.featuredRating, { color: colors.foreground }]}>
                      {worker.rating.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ── Workers List ────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 10 }]}>
          {selectedCategoryId
            ? (SERVICE_CATEGORIES.find(c => c.id === selectedCategoryId)?.name ?? '') + ' Workers'
            : 'All Workers'}
        </Text>
        {isLoading
          ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
          : displayedWorkers.length === 0
          ? (
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>
              No workers found in this category yet.
            </Text>
          )
          : displayedWorkers.map(w => (
            <WorkerCard
              key={w.id}
              worker={w}
              onPress={() => router.push(`/worker/${w.id}`)}
            />
          ))
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    ...shadow('md'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: { flex: 1 },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  appName: { fontSize: 26, fontFamily: 'Inter_700Bold', marginTop: 2 },
  tagline: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginLeft: 12,
  },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  clearBtn: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  catScroll: { paddingRight: 16 },
  featuredScroll: { paddingRight: 16, gap: 10 },
  featuredCard: {
    width: 108,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    gap: 5,
    ...shadow('sm'),
  },
  featuredAvatar: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredInitials: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  featuredName: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  featuredProf: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  featuredRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  featuredRating: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  emptyHint: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', paddingVertical: 32 },
});
