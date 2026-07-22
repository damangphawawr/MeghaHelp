/**
 * Step 2 — Professional details: languages, gender, service type,
 *           availability, district, service areas.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { FormInput } from '@/components/ui/FormInput';
import { PickerModal } from '@/components/ui/PickerModal';
import { Chip } from '@/components/ui/Chip';
import { DISTRICTS, LANGUAGES } from '@/constants/districts';
import type { Availability, ServiceType } from '@/types';
import type { RegisterFormState } from '@/hooks/useRegisterForm';

const AVAILABILITIES: Availability[] = ['Full-time', 'Part-time', 'Weekends', 'Flexible'];
const SERVICE_TYPES: ServiceType[]   = ['Home Visit', 'Customer Visits', 'Both'];
const GENDERS                        = ['Male', 'Female', 'Other'];

interface Props {
  form: RegisterFormState;
  setField: <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => void;
  toggleLang: (lang: string) => void;
}

export function Step2Professional({ form, setField, toggleLang }: Props) {
  const colors = useColors();
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <Text style={[styles.label, { color: colors.foreground }]}>Languages Spoken *</Text>
        <View style={styles.chips}>
          {LANGUAGES.map(lang => (
            <Chip
              key={lang}
              label={lang}
              isSelected={form.selectedLangs.includes(lang)}
              onPress={() => toggleLang(lang)}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={[styles.label, { color: colors.foreground }]}>Gender (Optional)</Text>
        <View style={styles.chips}>
          {GENDERS.map(g => (
            <Chip
              key={g}
              label={g}
              isSelected={form.gender === g}
              onPress={() => setField('gender', form.gender === g ? null : g)}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={[styles.label, { color: colors.foreground }]}>Service Type *</Text>
        <View style={styles.chips}>
          {SERVICE_TYPES.map(t => (
            <Chip
              key={t} label={t}
              isSelected={form.serviceType === t}
              onPress={() => setField('serviceType', t)}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={[styles.label, { color: colors.foreground }]}>Availability *</Text>
        <View style={styles.chips}>
          {AVAILABILITIES.map(a => (
            <Chip
              key={a} label={a}
              isSelected={form.availability === a}
              onPress={() => setField('availability', a)}
            />
          ))}
        </View>
      </View>

      <FormInput
        label="District" required
        placeholder="Select your district"
        value={form.district}
        onPress={() => setShowDistrictPicker(true)}
      />

      <FormInput
        label="Service Areas (Optional)"
        placeholder="e.g. Shillong, Mawlai, Laitumkhrah"
        value={form.serviceAreas}
        onChangeText={v => setField('serviceAreas', v)}
        hint="Separate areas with commas"
      />

      <PickerModal
        visible={showDistrictPicker}
        title="Select District"
        items={DISTRICTS}
        value={form.district}
        onSelect={v => setField('district', v)}
        onClose={() => setShowDistrictPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  group:     { gap: 6 },
  label:     { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  chips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
