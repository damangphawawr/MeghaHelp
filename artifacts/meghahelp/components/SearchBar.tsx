import React from 'react';
import {
  View, TextInput, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface SearchBarProps {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** When provided, the bar is read-only and fires onPress instead. */
  onPress?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search workers, services...',
  onPress,
  autoFocus = false,
}: SearchBarProps) {
  const colors = useColors();
  const isReadonly = !!onPress;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isReadonly ? 0.75 : 1}
      style={styles.wrapper}
    >
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          editable={!isReadonly}
          autoFocus={autoFocus && !isReadonly}
          style={[styles.input, { color: colors.foreground }]}
          returnKeyType="search"
        />
        {value.length > 0 && !isReadonly && (
          <TouchableOpacity onPress={() => onChangeText?.('')} hitSlop={8}>
            <Ionicons name="close-circle" size={17} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
});
