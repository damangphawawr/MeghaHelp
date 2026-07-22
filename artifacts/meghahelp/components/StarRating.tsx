import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

/** Displays a star rating. Set interactive=true and onRatingChange for input use. */
export function StarRating({
  rating,
  reviewCount,
  size = 16,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const colors = useColors();

  const renderStar = (star: number) => {
    const filled = star <= Math.floor(rating);
    const half = !filled && star - 0.5 <= rating;
    const name: keyof typeof Ionicons.glyphMap = filled
      ? 'star'
      : half
      ? 'star-half'
      : 'star-outline';

    if (interactive) {
      return (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange?.(star)}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? colors.accent : colors.border}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Ionicons
        key={star}
        name={name}
        size={size}
        color={filled || half ? colors.accent : colors.border}
      />
    );
  };

  const a11yLabel = interactive
    ? `Star rating, currently ${rating} out of 5`
    : `${rating.toFixed(1)} out of 5 stars${reviewCount !== undefined ? `, ${reviewCount} reviews` : ''}`;

  return (
    <View
      style={styles.container}
      accessible={!interactive}
      accessibilityLabel={interactive ? undefined : a11yLabel}
      accessibilityRole={interactive ? undefined : 'text'}
    >
      {[1, 2, 3, 4, 5].map(renderStar)}
      {reviewCount !== undefined && (
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {rating.toFixed(1)} ({reviewCount})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  count: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginLeft: 4,
  },
});
