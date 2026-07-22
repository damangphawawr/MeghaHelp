import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { shadow } from '@/utils/shadow';
import { Worker } from '@/types';
import { Avatar } from '@/components/Avatar';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/Badge';

interface WorkerCardProps {
  worker: Worker;
  onPress: () => void;
}

/** Compact worker card for use in lists and search results. */
export function WorkerCard({ worker, onPress }: WorkerCardProps) {
  const colors = useColors();

  const availabilityVariant =
    worker.availability === 'Full-time' ? 'success' :
    worker.availability === 'Weekends' ? 'warning' : 'primary';

  const displayProfession = worker.customProfession || worker.profession;

  const a11yLabel =
    `${worker.fullName}, ${displayProfession}, ` +
    `rated ${worker.rating} out of 5, ${worker.district}, ${worker.availability}`;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Opens worker profile"
    >
      <Avatar name={worker.fullName} photo={worker.profilePhoto} size={58} />

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {worker.fullName}
          </Text>
          {worker.isVerified && (
            <Ionicons name="checkmark-circle" size={15} color={colors.primary} />
          )}
        </View>

        <Text style={[styles.profession, { color: colors.primary }]} numberOfLines={1}>
          {displayProfession}
        </Text>

        <StarRating rating={worker.rating} reviewCount={worker.reviewCount} size={12} />

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={11} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
            {worker.district}
          </Text>
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
          <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {worker.yearsOfExperience}y exp
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {worker.price ? (
          <Text style={[styles.price, { color: colors.foreground }]} numberOfLines={2}>
            {worker.price}
          </Text>
        ) : null}
        <Badge label={worker.availability} variant={availabilityVariant} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    gap: 12,
    ...shadow('md'),
  },
  content: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  profession: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
    maxWidth: 95,
  },
  price: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
  },
});
