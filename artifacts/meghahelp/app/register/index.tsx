/**
 * Register Screen — coordinator for the 3-step worker registration flow.
 * Refactored: was 424 lines of mixed form state, UI, and business logic.
 * Now ~110 lines delegating to useRegisterForm + Step1/2/3 components.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Button } from '@/components/ui/Button';
import { shadow } from '@/utils/shadow';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { Step1BasicInfo } from './steps/Step1BasicInfo';
import { Step2Professional } from './steps/Step2Professional';
import { Step3Contact } from './steps/Step3Contact';

const STEP_LABELS = ['Basic Info', 'Professional', 'Contact'] as const;

// ── Step progress indicator ───────────────────────────────────────────────────
function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  const colors = useColors();
  return (
    <View
      style={styles.progress}
      accessible
      accessibilityLabel={`Step ${current} of 3: ${STEP_LABELS[current - 1]}`}
    >
      {([1, 2, 3] as const).map((n, i) => (
        <React.Fragment key={n}>
          <View style={[styles.dot, { backgroundColor: n <= current ? colors.primary : colors.border }]}>
            {n < current
              ? <Ionicons name="checkmark" size={14} color={colors.primaryForeground} />
              : <Text style={[styles.dotNum, { color: n === current ? colors.primaryForeground : colors.mutedForeground }]}>
                  {n}
                </Text>
            }
          </View>
          {i < 2 && (
            <View style={[styles.line, { backgroundColor: n < current ? colors.primary : colors.border }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { form, setField, toggleLang, pickPhoto, canProceed, submit, submitting } = useRegisterForm();

  const topPad    = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const goNext = () => step < 3 ? setStep(s => (s + 1) as 1 | 2 | 3) : submit();
  const goBack = () => step > 1 ? setStep(s => (s - 1) as 1 | 2 | 3) : router.back();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: topPad + 10, backgroundColor: colors.card, ...shadow('sm') }]}>
        <TouchableOpacity
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel={step > 1 ? 'Previous step' : 'Go back'}
        >
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>Become a Worker</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={step} />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>
          Step {step} of 3 — {STEP_LABELS[step - 1]}
        </Text>

        {step === 1 && (
          <Step1BasicInfo form={form} setField={setField} pickPhoto={pickPhoto} />
        )}
        {step === 2 && (
          <Step2Professional form={form} setField={setField} toggleLang={toggleLang} />
        )}
        {step === 3 && (
          <Step3Contact form={form} setField={setField} />
        )}

        <Button
          fullWidth
          disabled={!canProceed(step)}
          loading={submitting}
          onPress={goNext}
          rightIcon={
            !submitting
              ? <Ionicons
                  name={step === 3 ? 'checkmark' : 'arrow-forward'}
                  size={18}
                  color={canProceed(step) ? colors.primaryForeground : colors.mutedForeground}
                />
              : undefined
          }
          style={styles.nextBtn}
          accessibilityLabel={step === 3 ? 'Create my worker profile' : `Go to step ${step + 1}`}
        >
          {step === 3 ? 'Create Profile' : 'Next Step'}
        </Button>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  topTitle:  { fontSize: 17, fontFamily: 'Inter_700Bold' },
  scroll:    { paddingHorizontal: 20, paddingTop: 20, gap: 20 },
  progress:  { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  dotNum:    { fontSize: 14, fontFamily: 'Inter_700Bold' },
  line:      { flex: 1, height: 3, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: -10 },
  nextBtn:   { marginTop: 8 },
});
