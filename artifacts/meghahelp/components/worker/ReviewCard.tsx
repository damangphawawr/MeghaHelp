/**
 * ReviewCard — displays a single user review.
 * Extracted from worker/[id].tsx where it was defined inline.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { StarRating } from '@/components/StarRating';
import { Avatar } from '@/components/Avatar';
import { timeAgo } from '@/utils/time';
import { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const colors = useColors();

  return (
    <View
      style={[styles.container, { borderTopColor: colors.border }]}
      accessible
      accessibilityLabel={
        `Review by ${review.userName}, ${review.rating} out of 5 stars. ` +
        `${timeAgo(review.createdAt)}. ${review.comment}`
      }
    >
      <View style={styles.header}>
        <Avatar name={review.userName} photo={null} size={36} />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {review.userName}
            </Text>
            <Text style={[styles.date, { color: colors.mutedForeground }]}>
              {timeAgo(review.createdAt)}
            </Text>
          </View>
          <StarRating rating={review.rating} size={13} />
        </View>
      </View>
      <Text style={[styles.comment, { color: colors.mutedForeground }]}>
        {review.comment}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  headerText: { flex: 1, gap: 4 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  date: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  comment: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
});
