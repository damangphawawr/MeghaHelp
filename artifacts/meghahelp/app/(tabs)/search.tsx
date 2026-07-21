import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Platform, Modal, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useWorkers } from '@/context/WorkersContext';
import { WorkerCard } from '@/components/WorkerCard';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonCard } from '@/components/SkeletonCard';
import { SearchBar } from '@/components/SearchBar';
import { DISTRICTS } from '@/constants/districts';
import { PROFESSIONS } from '@/constants/categories';
import { SearchFilters, Availability } from '@/types';

const RATINGS = [4, 4.5, 4.8];
const AVAILABILITIES: Availability[] = ['Full-time', 'Part-time', 'Weekends', 'Flexible'];

type PickerType = 'district' | 'profession' | null;

const emptyFilters: SearchFilters = {
  query: '',
  profession: null,
  district: null,
  minRating: null,
  availability: null,
};

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLoading, filterWorkers } = useWorkers();

  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [pickerType, setPickerType] = useState<PickerType>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const activeFilterCount = [
    filters.district, filters.profession,
    filters.minRating, filters.availability,
  ].filter(Boolean).length;

  const results = useMemo(() => filterWorkers(filters), [filters, filterWorkers]);

  const setFilter = useCallback(<K extends keyof SearchFilters>(
    key: K, value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = () => setFilters(emptyFilters);

  const chipActive = (key: keyof SearchFilters, value: unknown) =>
    (filters[key] as unknown) === value;

  // ── Picker Modal ─────────────────────────────────────────────────────────
  const pickerItems = pickerType === 'district' ? DISTRICTS : PROFESSIONS;
  const pickerKey = pickerType === 'district' ? 'district' : 'profession';

  // ── List Header ──────────────────────────────────────────────────────────
  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 10, backgroundColor: colors.card }]}>
      <View style={styles.searchRow}>
        <SearchBar
          value={filters.query}
          onChangeText={t => setFilter('query', t)}
          autoFocus
        />
      </View>

      {/* Rating chips */}
      <View style={styles.chipRow}>
        <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Rating:</Text>
        {RATINGS.map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.chip,
              {
                backgroundColor: chipActive('minRating', r) ? colors.primary : colors.muted,
                borderColor: chipActive('minRating', r) ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter('minRating', chipActive('minRating', r) ? null : r)}
          >
            <Ionicons name="star" size={11} color={chipActive('minRating', r) ? '#fff' : colors.accent} />
            <Text style={[styles.chipText, { color: chipActive('minRating', r) ? '#fff' : colors.foreground }]}>
              {r}+
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Availability chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <View style={styles.chipRow}>
          <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>When:</Text>
          {AVAILABILITIES.map(a => (
            <TouchableOpacity
              key={a}
              style={[
                styles.chip,
                {
                  backgroundColor: chipActive('availability', a) ? colors.primary : colors.muted,
                  borderColor: chipActive('availability', a) ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter('availability', chipActive('availability', a) ? null : a)}
            >
              <Text style={[styles.chipText, { color: chipActive('availability', a) ? '#fff' : colors.foreground }]}>
                {a}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* District + Profession pickers */}
      <View style={styles.pickerRow}>
        <TouchableOpacity
          style={[
            styles.pickerBtn,
            {
              backgroundColor: filters.district ? colors.primary + '18' : colors.muted,
              borderColor: filters.district ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setPickerType('district')}
        >
          <Ionicons name="location-outline" size={14} color={filters.district ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.pickerText, { color: filters.district ? colors.primary : colors.mutedForeground }]} numberOfLines={1}>
            {filters.district ?? 'District'}
          </Text>
          {filters.district && (
            <TouchableOpacity onPress={() => setFilter('district', null)} hitSlop={8}>
              <Ionicons name="close-circle" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.pickerBtn,
            {
              backgroundColor: filters.profession ? colors.primary + '18' : colors.muted,
              borderColor: filters.profession ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setPickerType('profession')}
        >
          <Ionicons name="briefcase-outline" size={14} color={filters.profession ? colors.primary : colors.mutedForeground} />
          <Text style={[styles.pickerText, { color: filters.profession ? colors.primary : colors.mutedForeground }]} numberOfLines={1}>
            {filters.profession ?? 'Profession'}
          </Text>
          {filters.profession && (
            <TouchableOpacity onPress={() => setFilter('profession', null)} hitSlop={8}>
              <Ionicons name="close-circle" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {activeFilterCount > 0 && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={clearFilters}>
            <Text style={[styles.clearAllText, { color: colors.destructive }]}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
        {results.length} worker{results.length !== 1 ? 's' : ''} found
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={isLoading ? [] : results}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => (
          <WorkerCard
            worker={item}
            onPress={() => router.push(`/worker/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          isLoading
            ? <View style={{ paddingTop: 8 }}>{[0, 1, 2].map(i => <SkeletonCard key={i} />)}</View>
            : <EmptyState
                icon="search-outline"
                title="No workers found"
                message="Try different keywords or remove some filters to see more results."
              />
        }
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/* ── Picker Modal ──────────────────────────────────────────────── */}
      <Modal
        visible={pickerType !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerType(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerType(null)}
        />
        <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>
            {pickerType === 'district' ? 'Select District' : 'Select Profession'}
          </Text>
          <FlatList
            data={pickerItems}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isActive = (filters[pickerKey] as string | null) === item;
              return (
                <TouchableOpacity
                  style={[styles.modalItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setFilter(pickerKey, isActive ? null : item);
                    setPickerType(null);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: isActive ? colors.primary : colors.foreground, fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>
                    {item}
                  </Text>
                  {isActive && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </TouchableOpacity>
              );
            }}
            style={{ maxHeight: 400 }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 14, gap: 10 },
  searchRow: { flexDirection: 'row' },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  chipScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  filterLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
  },
  chipText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  pickerRow: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  pickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, flex: 1, maxWidth: 180,
  },
  pickerText: { fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
  clearAllBtn: { paddingHorizontal: 6 },
  clearAllText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  resultCount: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 16, paddingBottom: 40,
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  modalItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalItemText: { fontSize: 15 },
});
