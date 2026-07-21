import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
  TextInput, ScrollView, Modal, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { DISTRICTS, TOWNS_BY_DISTRICT } from '@/constants/districts';

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateProfile, setNeedsOnboarding } = useAuth();

  const [phone, setPhone] = useState(user?.phone ?? '');
  const [district, setDistrict] = useState(user?.district ?? '');
  const [town, setTown] = useState(user?.town ?? '');
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showTownPicker, setShowTownPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const availableTowns = district ? (TOWNS_BY_DISTRICT[district] ?? []) : [];

  const handleSave = async () => {
    setSaving(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateProfile({ phone: phone.trim() || null, district: district || null, town: town || null });
    setNeedsOnboarding(false);
    setSaving(false);
    router.replace('/(tabs)');
  };

  const PickerModal = ({
    visible, title, items, onSelect, onClose,
  }: {
    visible: boolean;
    title: string;
    items: string[];
    onSelect: (v: string) => void;
    onClose: () => void;
  }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Text style={[styles.modalTitle, { color: colors.foreground }]}>{title}</Text>
        <FlatList
          data={items}
          keyExtractor={i => i}
          style={{ maxHeight: 360 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.modalItem, { borderBottomColor: colors.border }]}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <Text style={[styles.modalItemText, { color: colors.foreground }]}>{item}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.border} />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 24, paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="person-add-outline" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Welcome, {user?.name?.split(' ')[0] ?? 'there'}!
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Tell us a bit about yourself so we can show you workers near you.
          </Text>
        </View>

        {/* Phone */}
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: colors.foreground }]}>Phone Number</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="call-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="+91 XXXXX XXXXX"
              placeholderTextColor={colors.mutedForeground}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* District */}
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: colors.foreground }]}>District</Text>
          <TouchableOpacity
            style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDistrictPicker(true)}
          >
            <Ionicons name="location-outline" size={18} color={colors.mutedForeground} />
            <Text style={[styles.input, { color: district ? colors.foreground : colors.mutedForeground }]}>
              {district || 'Select your district'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Town */}
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: colors.foreground }]}>Town / Village</Text>
          {availableTowns.length > 0 ? (
            <TouchableOpacity
              style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowTownPicker(true)}
            >
              <Ionicons name="map-outline" size={18} color={colors.mutedForeground} />
              <Text style={[styles.input, { color: town ? colors.foreground : colors.mutedForeground }]}>
                {town || 'Select your town'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="map-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Enter your town or village"
                placeholderTextColor={colors.mutedForeground}
                value={town}
                onChangeText={setTown}
              />
            </View>
          )}
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Continue'}</Text>
          {!saving && <Ionicons name="arrow-forward" size={18} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => { setNeedsOnboarding(false); router.replace('/(tabs)'); }}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip for now</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollViewCompat>

      <PickerModal
        visible={showDistrictPicker}
        title="Select District"
        items={DISTRICTS}
        onSelect={v => { setDistrict(v); setTown(''); }}
        onClose={() => setShowDistrictPicker(false)}
      />
      <PickerModal
        visible={showTownPicker}
        title="Select Town"
        items={availableTowns}
        onSelect={v => setTown(v)}
        onClose={() => setShowTownPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 20 },
  header: { alignItems: 'center', gap: 12, marginBottom: 8 },
  iconWrap: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 21 },
  fieldBlock: { gap: 6 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1, gap: 10,
  },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', padding: 0 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 14, marginTop: 8,
  },
  saveBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  modalItemText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
