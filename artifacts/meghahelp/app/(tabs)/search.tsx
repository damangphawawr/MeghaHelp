/**
 * Search Screen
 * Refactored: was 288 lines mixing filter chips, picker modals, and list
 * rendering in a single component. Now ~80 lines using FilterSheet.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useWorkers } from '@/context/WorkersContext';
import { WorkerCard } from '@/components/WorkerCard';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonCard } from '@/components/SkeletonCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterSheet } from '@/components/search/FilterSheet';
import type { SearchFilters } from '@/types';

const EMPTY_FILTERS: SearchFilters = {
  query: '', profession: null, district: null, minRating: null, availability: null,
};

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLoading, filterWorkers } = useWorkers();

  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);

  const setFilter  = useCallback((patch: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...patch }));
  }, []);

  const onClear    = useCallback(() => setFilters(EMPTY_FILTERS), []);
  const results    = useMemo(() => filterWorkers(filters), [filters, filterWorkers]);

  const topPad    = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const Header = (
    <>
      <View style={[styles.searchHeader, { paddingTop: topPad + 10, backgroundColor: colors.card }]}>
        <SearchBar
          value={filters.query}
          onChangeText={q => setFilter({ query: q })}
          autoFocus
        />
      </View>
      <FilterSheet
        filters={filters}
        setFilter={setFilter}
        onClear={onClear}
        resultCount={results.length}
      />
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={isLoading ? [] : results}
        keyExtractor={item => item.id}
        ListHeaderComponent={Header}
        renderItem={({ item }) => (
          <WorkerCard
            worker={item}
            onPress={() => router.push(`/worker/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          isLoading
            ? <View style={styles.skeletons}>{[0, 1, 2].map(i => <SkeletonCard key={i} />)}</View>
            : <EmptyState
                icon="search-outline"
                title="No workers found"
                message="Try different keywords or remove some filters to see more results."
              />
        }
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  searchHeader: { paddingHorizontal: 16, paddingBottom: 12 },
  skeletons:    { paddingTop: 8 },
});
