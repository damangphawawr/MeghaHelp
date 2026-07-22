/**
 * Step 3 — Contact & pricing: phone, WhatsApp, optional rate.
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { FormInput } from '@/components/ui/FormInput';
import type { RegisterFormState } from '@/hooks/useRegisterForm';

interface Props {
  form: RegisterFormState;
  setField: <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => void;
}

export function Step3Contact({ form, setField }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <FormInput
        label="Phone Number" required
        placeholder="+91 XXXXX XXXXX"
        value={form.phone}
        onChangeText={v => setField('phone', v)}
        keyboardType="phone-pad"
        leftIcon="call-outline"
      />

      <View style={styles.whatsappGroup}>
        <FormInput
          label="WhatsApp Number" required
          placeholder="+91 XXXXX XXXXX"
          value={form.whatsapp}
          onChangeText={v => setField('whatsapp', v)}
          keyboardType="phone-pad"
          leftIcon="logo-whatsapp"
        />
        {form.phone.trim() && (
          <TouchableOpacity
            onPress={() => setField('whatsapp', form.phone)}
            accessibilityRole="button"
            accessibilityLabel="Copy phone number to WhatsApp field"
          >
            <Text style={[styles.copyHint, { color: colors.primary }]}>
              Same as phone number
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FormInput
        label="Your Rate (Optional)"
        placeholder="e.g. ₹500 per visit, ₹8,000/month"
        value={form.price}
        onChangeText={v => setField('price', v)}
        leftIcon="pricetag-outline"
        hint="Help customers understand your pricing upfront"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { gap: 16 },
  whatsappGroup: { gap: 4 },
  copyHint:      { fontSize: 12, fontFamily: 'Inter_500Medium' },
});
