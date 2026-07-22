/**
 * FilterSheet — all search filter controls in one component.
 *
 * Extracted from search.tsx which mixed search state, filter UI,
 * and list rendering in 288 lines.
 *
 * Manages its own picker modal visibility; exposes a flat
 * `setFilter(patch)` API to the parent.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Chip } from '@/components/ui/Chip';
import { PickerModal } from '@/components/ui/PickerModal';
import { DISTRICTS } from '@/constants/districts';
import { PROFESSIONS } from '@/constants/categories';
import type { SearchFilters, Availability } from '@/types';

const RATINGS: number[]           = [4, 4.5, 4.8];
const AVAILABILITIES: Availability[] = ['Full-time', 'Part-time', 'Weekends', 'Flexible'];

interface Props {
  filters: SearchFilters;
  setFilter: (patch: Partial<SearchFilters>) => void;
  onClear: () => void;
  resultCount: number;
}

export function FilterSheet({ filters, setFilter, onClear, resultCount }: Props) {
  const colors = useColors();
  const [showDistrict,   setShowDistrict]   = useState(false);
  const [showProfession, setShowProfession] = useState(false);

  const activeCount = [
    filters.district, filters.profession, filters.minRating, filters.availability,
  ].filter(Boolean).length;

  return (
    <View style={styles.wrapper}>
      {/* Rating chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>Rating:</Text>
          {RATINGS.map(r => (
            <Chip
              key={r}
              label={`${r}+`}
              icon="star"
              isSelected={filters.minRating === r}
              onPress={() => setFilter({ minRating: filters.minRating === r ? null : r })}
              accessibilityLabel={`Minimum rating ${r} stars`}
            />
          ))}
        </View>
      </ScrollView>

      {/* Availability chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>When:</Text>
          {AVAILABILITIES.map(a => (
            <Chip
              key={a}
              label={a}
              isSelected={filters.availability === a}
              onPress={() => setFilter({ availability: filters.availability === a ? null : a })}
            />
          ))}
        </View>
      </ScrollView>

      {/* District + Profession picker buttons */}
      <View style={styles.pickerRow}>
        <PickerButton
          label={filters.district ?? 'District'}
          icon="location-outline"
          active={!!filters.district}
          onPress={() => setShowDistrict(true)}
          onClear={() => setFilter({ district: null })}
          colors={colors}
        />
        <PickerButton
          label={filters.profession ?? 'Profession'}
          icon="briefcase-outline"
          active={!!filters.profession}
          onPress={() => setShowProfession(true)}
          onClear={() => setFilter({ profession: null })}
          colors={colors}
        />
        {activeCount > 0 && (
          <TouchableOpacity
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
          >
            <Text style={[styles.clearAll, { color: colors.destructive }]}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.count, { color: colors.mutedForeground }]}>
        {resultCount} worker{resultCount !== 1 ? 's' : ''} found
      </Text>

      <PickerModal
        visible={showDistrict}
        title="Select District"
        items={DISTRICTS}
        value={filters.district}
        onSelect={v => setFilter({ district: v })}
        onClose={() => setShowDistrict(false)}
      />
      <PickerModal
        visible={showProfession}
        title="Select Profession"
        items={PROFESSIONS}
        value={filters.profession}
        onSelect={v => setFilter({ profession: v })}
        onClose={() => setShowProfession(false)}
      />
    </View>
  );
}

// ── Local helper ─────────────────────────────────────────────────────────────
interface PickerButtonProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  active: boolean;
  onPress: () => void;
  onClear: () => void;
  colors: ReturnType<typeof useColors>;
}

function PickerButton({ label, icon, active, onPress, onClear, colors }: PickerButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.pickerBtn,
        {
          backgroundColor: active ? colors.primary + '18' : colors.muted,
          borderColor:     active ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filter by ${label}`}
    >
      <Ionicons name={icon} size={14} color={active ? colors.primary : colors.mutedForeground} />
      <Text style={[styles.pickerLabel, { color: active ? colors.primary : colors.mutedForeground }]} numberOfLines={1}>
        {label}
      </Text>
      {active && (
        <TouchableOpacity onPress={onClear} hitSlop={8} accessibilityLabel={`Remove ${label} filter`}>
          <Ionicons name="close-circle" size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper:    { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabel:   { fontSize: 12, fontFamily: 'Inter_500Medium' },
  pickerRow:  { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  pickerBtn:  {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, flex: 1, maxWidth: 180,
  },
  pickerLabel: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  clearAll:    { fontSize: 13, fontFamily: 'Inter_500Medium', paddingHorizontal: 6 },
  count:       { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
