/**
 * Chip — selectable filter/option chip with full accessibility support.
 *
 * Used for: availability filters, language selection, rating filters,
 * gender selection, service type selection, etc.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface ChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Chip({
  label, isSelected = false, onPress,
  icon, style, accessibilityLabel, accessibilityHint,
}: ChipProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? colors.primary : colors.muted,
          borderColor:     isSelected ? colors.primary : colors.border,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={isSelected ? colors.primaryForeground : colors.mutedForeground}
        />
      )}
      <Text
        style={[
          styles.text,
          { color: isSelected ? colors.primaryForeground : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  text: { fontSize: 13, fontFamily: 'Inter_500Medium' },
});
