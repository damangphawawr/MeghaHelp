/**
 * Step 1 — Basic info: photo, name, profession, about, experience.
 */
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { FormInput } from '@/components/ui/FormInput';
import { PickerModal } from '@/components/ui/PickerModal';
import { PROFESSIONS } from '@/constants/categories';
import type { RegisterFormState } from '@/hooks/useRegisterForm';

interface Props {
  form: RegisterFormState;
  setField: <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => void;
  pickPhoto: () => Promise<void>;
}

export function Step1BasicInfo({ form, setField, pickPhoto }: Props) {
  const colors = useColors();
  const [showProfessionPicker, setShowProfessionPicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* Profile photo */}
      <TouchableOpacity
        onPress={pickPhoto}
        style={styles.photoWrap}
        accessibilityRole="button"
        accessibilityLabel={form.photo ? 'Change profile photo' : 'Add profile photo'}
      >
        {form.photo ? (
          <Image source={{ uri: form.photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="camera-outline" size={30} color={colors.mutedForeground} />
          </View>
        )}
      </TouchableOpacity>

      <FormInput
        label="Full Name" required
        placeholder="e.g. Bah John Doe"
        value={form.fullName}
        onChangeText={v => setField('fullName', v)}
        autoCapitalize="words"
      />

      <FormInput
        label="Profession" required
        placeholder="Select your profession"
        value={form.profession}
        onPress={() => setShowProfessionPicker(true)}
      />

      {form.profession === 'Other' && (
        <FormInput
          label="Describe your service" required
          placeholder="e.g. Mobile Car Wash"
          value={form.customProfession}
          onChangeText={v => setField('customProfession', v)}
        />
      )}

      <FormInput
        label="About Me" required
        placeholder="Describe your skills, experience, and what makes you the best choice…"
        value={form.about}
        onChangeText={v => setField('about', v)}
        multiline
        numberOfLines={4}
        style={{ minHeight: 90, textAlignVertical: 'top' }}
      />

      <FormInput
        label="Years of Experience" required
        placeholder="e.g. 5"
        value={form.experience}
        onChangeText={v => setField('experience', v)}
        keyboardType="numeric"
      />

      <PickerModal
        visible={showProfessionPicker}
        title="Select Profession"
        items={PROFESSIONS}
        value={form.profession}
        onSelect={v => setField('profession', v)}
        onClose={() => setShowProfessionPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { gap: 16 },
  photoWrap:        { alignSelf: 'center' },
  photo:            { width: 90, height: 90, borderRadius: 45 },
  photoPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderStyle: 'dashed',
  },
});
