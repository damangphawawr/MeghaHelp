import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, TextInput, ScrollView, Modal,
  FlatList, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useWorkers } from '@/context/WorkersContext';
import { PROFESSIONS } from '@/constants/categories';
import { DISTRICTS, LANGUAGES } from '@/constants/districts';
import { Worker, Availability, ServiceType } from '@/types';

type Step = 1 | 2 | 3;
const TOTAL_STEPS = 3;

const AVAILABILITIES: Availability[] = ['Full-time', 'Part-time', 'Weekends', 'Flexible'];
const SERVICE_TYPES: ServiceType[] = ['Home Visit', 'Customer Visits', 'Both'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { addWorker } = useWorkers();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [step, setStep] = useState<Step>(1);
  const [showPicker, setShowPicker] = useState<'profession' | 'district' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [photo, setPhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [gender, setGender] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('Home Visit');
  const [availability, setAvailability] = useState<Availability>('Full-time');
  const [district, setDistrict] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [price, setPrice] = useState('');

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please allow photo access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const toggleLang = (lang: string) =>
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );

  const canProceed = (s: Step) => {
    if (s === 1) return fullName.trim() && profession && about.trim() && experience;
    if (s === 2) return selectedLangs.length > 0 && district;
    return phone.trim() && whatsapp.trim();
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(prev => (prev + 1) as Step);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!user) { Alert.alert('Sign in required', 'Please sign in first.'); return; }
    setSubmitting(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const worker: Worker = {
      id: `worker_${Date.now().toString(36)}`,
      fullName: fullName.trim(),
      profilePhoto: photo,
      profession,
      customProfession: profession === 'Other' ? customProfession.trim() || null : null,
      about: about.trim(),
      yearsOfExperience: parseInt(experience) || 0,
      languages: selectedLangs,
      gender: (gender as Worker['gender']) ?? null,
      serviceAreas: serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      district,
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      price: price.trim() || null,
      availability,
      serviceType,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      isApproved: true,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    };
    await addWorker(worker);
    setSubmitting(false);
    Alert.alert(
      'Profile Created!',
      'Your worker profile is now live. Customers can find and contact you.',
      [{ text: 'View Profile', onPress: () => router.replace(`/worker/${worker.id}`) }]
    );
  };

  // ── Step indicators ────────────────────────────────────────────────────
  const StepIndicator = () => (
    <View style={styles.stepRow}>
      {[1, 2, 3].map(s => (
        <View key={s} style={styles.stepItem}>
          <View style={[
            styles.stepDot,
            { backgroundColor: s <= step ? colors.primary : colors.border },
          ]}>
            {s < step
              ? <Ionicons name="checkmark" size={14} color="#fff" />
              : <Text style={[styles.stepNum, { color: s === step ? '#fff' : colors.mutedForeground }]}>{s}</Text>
            }
          </View>
          {s < 3 && (
            <View style={[styles.stepLine, { backgroundColor: s < step ? colors.primary : colors.border }]} />
          )}
        </View>
      ))}
    </View>
  );

  // ── Reusable field components ──────────────────────────────────────────
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      {children}
    </View>
  );

  const InputWrap = ({ children }: { children: React.ReactNode }) => (
    <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {children}
    </View>
  );

  const ChipRow = <T extends string>({
    options, value, onSelect,
  }: { options: T[]; value: T; onSelect: (v: T) => void }) => (
    <View style={styles.chipRow}>
      {options.map(o => (
        <TouchableOpacity
          key={o}
          style={[styles.chip, { backgroundColor: value === o ? colors.primary : colors.muted, borderColor: value === o ? colors.primary : colors.border }]}
          onPress={() => onSelect(o)}
        >
          <Text style={[styles.chipText, { color: value === o ? '#fff' : colors.foreground }]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ── Picker modal ───────────────────────────────────────────────────────
  const pickerItems = showPicker === 'profession' ? PROFESSIONS : DISTRICTS;
  const pickerTitle = showPicker === 'profession' ? 'Select Profession' : 'Select District';
  const pickerValue = showPicker === 'profession' ? profession : district;
  const onPickerSelect = showPicker === 'profession'
    ? (v: string) => { setProfession(v); setShowPicker(null); }
    : (v: string) => { setDistrict(v); setShowPicker(null); };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: topPad + 10, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(prev => (prev - 1) as Step) : router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>Become a Worker</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>
          Step {step} of {TOTAL_STEPS} — {['Basic Info', 'Professional Details', 'Contact & Pricing'][step - 1]}
        </Text>

        {/* ── Step 1 ─────────────────────────────────────────────── */}
        {step === 1 && (
          <>
            {/* Photo picker */}
            <TouchableOpacity style={styles.photoPicker} onPress={pickPhoto}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoImg} />
              ) : (
                <View style={[styles.photoPlaceholder, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <Ionicons name="camera-outline" size={32} color={colors.mutedForeground} />
                  <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <Field label="Full Name *">
              <InputWrap>
                <TextInput style={[styles.inputText, { color: colors.foreground }]} placeholder="e.g. Bah John Doe" placeholderTextColor={colors.mutedForeground} value={fullName} onChangeText={setFullName} />
              </InputWrap>
            </Field>

            <Field label="Profession *">
              <TouchableOpacity
                style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowPicker('profession')}
              >
                <Text style={[styles.inputText, { color: profession ? colors.foreground : colors.mutedForeground }]}>
                  {profession || 'Select your profession'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </Field>

            {profession === 'Other' && (
              <Field label="Custom Profession *">
                <InputWrap>
                  <TextInput style={[styles.inputText, { color: colors.foreground }]} placeholder="Describe your service" placeholderTextColor={colors.mutedForeground} value={customProfession} onChangeText={setCustomProfession} />
                </InputWrap>
              </Field>
            )}

            <Field label="About Me *">
              <InputWrap>
                <TextInput style={[styles.inputText, { color: colors.foreground, minHeight: 90, textAlignVertical: 'top' }]} placeholder="Describe your skills, experience, and what makes you the best choice..." placeholderTextColor={colors.mutedForeground} value={about} onChangeText={setAbout} multiline numberOfLines={4} />
              </InputWrap>
            </Field>

            <Field label="Years of Experience *">
              <InputWrap>
                <TextInput style={[styles.inputText, { color: colors.foreground }]} placeholder="e.g. 5" placeholderTextColor={colors.mutedForeground} value={experience} onChangeText={setExperience} keyboardType="numeric" />
              </InputWrap>
            </Field>
          </>
        )}

        {/* ── Step 2 ─────────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <Field label="Languages Spoken *">
              <View style={styles.langGrid}>
                {LANGUAGES.map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.chip, { backgroundColor: selectedLangs.includes(lang) ? colors.primary : colors.muted, borderColor: selectedLangs.includes(lang) ? colors.primary : colors.border }]}
                    onPress={() => toggleLang(lang)}
                  >
                    <Text style={[styles.chipText, { color: selectedLangs.includes(lang) ? '#fff' : colors.foreground }]}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            <Field label="Gender (Optional)">
              <ChipRow options={GENDERS as any} value={gender ?? ''} onSelect={v => setGender(prev => prev === v ? null : v)} />
            </Field>

            <Field label="Service Type *">
              <ChipRow options={SERVICE_TYPES} value={serviceType} onSelect={setServiceType} />
            </Field>

            <Field label="Availability *">
              <ChipRow options={AVAILABILITIES} value={availability} onSelect={setAvailability} />
            </Field>

            <Field label="District *">
              <TouchableOpacity
                style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowPicker('district')}
              >
                <Text style={[styles.inputText, { color: district ? colors.foreground : colors.mutedForeground }]}>
                  {district || 'Select your district'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </Field>

            <Field label="Service Areas (Optional)">
              <InputWrap>
                <TextInput style={[styles.inputText, { color: colors.foreground }]} placeholder="e.g. Shillong, Mawlai, Laitumkhrah" placeholderTextColor={colors.mutedForeground} value={serviceAreas} onChangeText={setServiceAreas} />
              </InputWrap>
              <Text style={[styles.hint, { color: colors.mutedForeground }]}>Separate areas with commas</Text>
            </Field>
          </>
        )}

        {/* ── Step 3 ─────────────────────────────────────────────── */}
        {step === 3 && (
          <>
            <Field label="Phone Number *">
              <InputWrap>
                <Ionicons name="call-outline" size={18} color={colors.mutedForeground} />
                <TextInput style={[styles.inputText, { color: colors.foreground, flex: 1 }]} placeholder="+91 XXXXX XXXXX" placeholderTextColor={colors.mutedForeground} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </InputWrap>
            </Field>

            <Field label="WhatsApp Number *">
              <InputWrap>
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <TextInput style={[styles.inputText, { color: colors.foreground, flex: 1 }]} placeholder="+91 XXXXX XXXXX" placeholderTextColor={colors.mutedForeground} value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
              </InputWrap>
              <TouchableOpacity onPress={() => setWhatsapp(phone)}>
                <Text style={[styles.hint, { color: colors.primary }]}>Same as phone number</Text>
              </TouchableOpacity>
            </Field>

            <Field label="Your Rate (Optional)">
              <InputWrap>
                <Ionicons name="pricetag-outline" size={18} color={colors.mutedForeground} />
                <TextInput style={[styles.inputText, { color: colors.foreground, flex: 1 }]} placeholder="e.g. ₹500 per visit, ₹8,000/month" placeholderTextColor={colors.mutedForeground} value={price} onChangeText={setPrice} />
              </InputWrap>
            </Field>
          </>
        )}

        {/* Next / Submit button */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: canProceed(step) ? colors.primary : colors.muted, marginTop: 12 }]}
          onPress={handleNext}
          disabled={!canProceed(step) || submitting}
        >
          <Text style={[styles.nextBtnText, { color: canProceed(step) ? '#fff' : colors.mutedForeground }]}>
            {step === TOTAL_STEPS ? (submitting ? 'Creating Profile...' : 'Create Profile') : 'Next Step'}
          </Text>
          {!submitting && <Ionicons name={step === TOTAL_STEPS ? 'checkmark' : 'arrow-forward'} size={18} color={canProceed(step) ? '#fff' : colors.mutedForeground} />}
        </TouchableOpacity>
      </KeyboardAwareScrollViewCompat>

      {/* Picker Modal */}
      <Modal visible={showPicker !== null} transparent animationType="slide" onRequestClose={() => setShowPicker(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPicker(null)} />
        <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{pickerTitle}</Text>
          <FlatList
            data={pickerItems}
            keyExtractor={i => i}
            style={{ maxHeight: 420 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, { borderBottomColor: colors.border }]}
                onPress={() => onPickerSelect(item)}
              >
                <Text style={[styles.modalItemText, { color: item === pickerValue ? colors.primary : colors.foreground, fontFamily: item === pickerValue ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>{item}</Text>
                {item === pickerValue && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  topTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  stepLine: { width: 48, height: 3, marginHorizontal: 4, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: -8 },
  photoPicker: { alignSelf: 'center', marginBottom: 4 },
  photoImg: { width: 90, height: 90, borderRadius: 45 },
  photoPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderStyle: 'dashed', gap: 4,
  },
  photoHint: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  field: { gap: 6 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: 12, borderWidth: 1, gap: 8,
  },
  inputText: { fontSize: 15, fontFamily: 'Inter_400Regular', flex: 1, padding: 0 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  hint: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 14,
  },
  nextBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 16, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  modalItemText: { fontSize: 15 },
});
