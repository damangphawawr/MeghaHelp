/**
 * FormInput — labeled TextInput wrapper with hint, error, and icon support.
 *
 * Replaces the repeated inputWrap + label + hint pattern across all form
 * screens.  Pass `onPress` to render the whole field as a picker trigger
 * (non-editable, chevron-style).
 */
import React from 'react';
import {
  View, Text, TextInput, TextInputProps,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface FormInputProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Placed on the trailing edge — pass an icon button or other element */
  rightElement?: React.ReactNode;
  /**
   * When set, wraps the input row in a TouchableOpacity and disables
   * direct text editing. Use for picker-style inputs.
   */
  onPress?: () => void;
}

export function FormInput({
  label, hint, error, required,
  leftIcon, rightElement, onPress,
  style, ...inputProps
}: FormInputProps) {
  const colors = useColors();
  const borderColor = error ? colors.destructive : colors.border;
  const isPickerMode = !!onPress;

  const InputRow = (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor }]}>
      {leftIcon && (
        <Ionicons name={leftIcon} size={18} color={colors.mutedForeground} />
      )}
      <TextInput
        editable={!isPickerMode}
        style={[styles.input, { color: colors.foreground }, style]}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={label}
        {...inputProps}
      />
      {isPickerMode && !rightElement && (
        <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
      )}
      {rightElement}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.foreground }]}>
        {label}
        {required && <Text style={{ color: colors.destructive }}> *</Text>}
      </Text>

      {isPickerMode
        ? (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Select ${label}`}
          >
            {InputRow}
          </TouchableOpacity>
        )
        : InputRow
      }

      {(hint || error) && (
        <Text
          style={[
            styles.hint,
            { color: error ? colors.destructive : colors.mutedForeground },
          ]}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 5 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  hint: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
