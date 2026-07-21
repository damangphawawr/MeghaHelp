import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'muted' | 'verified';

interface BadgeProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: BadgeVariant;
}

/** Small status/label badge with icon support. */
export function Badge({ label, icon, variant = 'muted' }: BadgeProps) {
  const colors = useColors();

  const bgMap: Record<BadgeVariant, string> = {
    primary: colors.primary + '18',
    success: colors.success + '18',
    warning: colors.accent + '18',
    muted: colors.muted,
    verified: colors.primary + '18',
  };

  const colorMap: Record<BadgeVariant, string> = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.accent,
    muted: colors.mutedForeground,
    verified: colors.primary,
  };

  const bg = bgMap[variant];
  const fg = colorMap[variant];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {icon && <Ionicons name={icon} size={11} color={fg} style={{ marginRight: 3 }} />}
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});
