/**
 * PickerModal — reusable bottom-sheet item picker.
 *
 * Extracted from search.tsx, onboarding.tsx, and register/index.tsx
 * where the same ~40-line modal pattern was duplicated verbatim.
 *
 * Accessibility: accessibilityViewIsModal, each item has accessibilityRole="radio".
 */
import React from 'react';
import {
  Modal, View, Text, FlatList,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export type PickerItem = string | { label: string; value: string };

interface PickerModalProps {
  visible: boolean;
  title: string;
  items: PickerItem[];
  value: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function PickerModal({
  visible, title, items, value, onSelect, onClose,
}: PickerModalProps) {
  const colors = useColors();

  const normalized = items.map(i =>
    typeof i === 'string' ? { label: i, value: i } : i,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
        accessibilityLabel="Close"
      />
      <View style={[styles.sheet, { backgroundColor: colors.card }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close picker"
          >
            <Ionicons name="close" size={22} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={normalized}
          keyExtractor={item => item.value}
          style={{ maxHeight: 420 }}
          renderItem={({ item }) => {
            const active = item.value === value;
            return (
              <TouchableOpacity
                style={[styles.item, { borderBottomColor: colors.border }]}
                onPress={() => { onSelect(item.value); onClose(); }}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item.label}
              >
                <Text style={[
                  styles.itemText,
                  {
                    color:      active ? colors.primary : colors.foreground,
                    fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  },
                ]}>
                  {item.label}
                </Text>
                {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 16, paddingBottom: 40,
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: { fontSize: 15 },
});
