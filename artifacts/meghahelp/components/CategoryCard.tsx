import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { ServiceCategory } from '@/constants/categories';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
  isSelected?: boolean;
}

/** Vertical category card with icon, used in horizontal scroll. */
export function CategoryCard({ category, onPress, isSelected = false }: CategoryCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? category.color : colors.card,
          borderColor: isSelected ? category.color : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconBg,
          {
            backgroundColor: isSelected
              ? 'rgba(255,255,255,0.22)'
              : category.color + '1A',
          },
        ]}
      >
        <Ionicons
          name={category.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={isSelected ? '#fff' : category.color}
        />
      </View>
      <Text
        style={[styles.name, { color: isSelected ? '#fff' : colors.foreground }]}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 82,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    marginRight: 10,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    lineHeight: 15,
  },
});
