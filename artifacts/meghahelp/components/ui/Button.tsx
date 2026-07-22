/**
 * Button — single source of truth for all pressable actions.
 *
 * Variants : primary | secondary | outline | ghost | danger
 * Sizes    : sm | md | lg
 *
 * Accessibility: sets accessibilityRole="button", accessibilityState
 * automatically. Pass accessibilityLabel for icon-only buttons.
 */
import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, ViewStyle,
} from 'react-native';
import { useColors } from '@/hooks/useColors';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Stretches to fill parent width */
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

const PADDING: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number }> = {
  sm: { paddingVertical: 8,  paddingHorizontal: 14 },
  md: { paddingVertical: 13, paddingHorizontal: 20 },
  lg: { paddingVertical: 16, paddingHorizontal: 24 },
};

const FONT_SIZE: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 16 };

export function Button({
  children, onPress,
  variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false,
  leftIcon, rightIcon,
  accessibilityLabel, accessibilityHint,
  style,
}: ButtonProps) {
  const colors = useColors();
  const isDisabled = disabled || loading;

  const bg: Record<ButtonVariant, string> = {
    primary:   colors.primary,
    secondary: colors.secondary,
    outline:   'transparent',
    ghost:     'transparent',
    danger:    colors.destructive,
  };

  const fg: Record<ButtonVariant, string> = {
    primary:   colors.primaryForeground,
    secondary: colors.secondaryForeground,
    outline:   colors.primary,
    ghost:     colors.foreground,
    danger:    colors.destructiveForeground,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        PADDING[size],
        {
          backgroundColor: bg[variant],
          borderColor:  variant === 'outline' ? colors.primary : 'transparent',
          borderWidth:  variant === 'outline' ? 1.5 : 0,
          alignSelf:    fullWidth ? 'stretch' : 'flex-start',
          opacity:      isDisabled ? 0.55 : 1,
          borderRadius: colors.radius,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg[variant]} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.label, { color: fg[variant], fontSize: FONT_SIZE[size] }]}>
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: { fontFamily: 'Inter_600SemiBold' },
});
