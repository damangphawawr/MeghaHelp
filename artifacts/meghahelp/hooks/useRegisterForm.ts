/**
 * useRegisterForm — all state and logic for the 3-step worker registration flow.
 *
 * Extracted from register/index.tsx (was 424 lines).
 * Each step component receives only the slice it needs.
 */
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/context/AuthContext';
import { useWorkers } from '@/context/WorkersContext';
import { Worker, Availability, ServiceType } from '@/types';

export interface RegisterFormState {
  // Step 1 — Basic info
  photo: string | null;
  fullName: string;
  profession: string;
  customProfession: string;
  about: string;
  experience: string;
  // Step 2 — Professional details
  selectedLangs: string[];
  gender: string | null;
  serviceType: ServiceType;
  availability: Availability;
  district: string;
  serviceAreas: string;
  // Step 3 — Contact & pricing
  phone: string;
  whatsapp: string;
  price: string;
}

const INITIAL: RegisterFormState = {
  photo: null, fullName: '', profession: '', customProfession: '',
  about: '', experience: '', selectedLangs: [], gender: null,
  serviceType: 'Home Visit', availability: 'Full-time',
  district: '', serviceAreas: '', phone: '', whatsapp: '', price: '',
};

export function useRegisterForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { addWorker } = useWorkers();
  const [form, setForm]         = useState<RegisterFormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback(
    <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
    }, [],
  );

  const toggleLang = useCallback((lang: string) => {
    setForm(prev => ({
      ...prev,
      selectedLangs: prev.selectedLangs.includes(lang)
        ? prev.selectedLangs.filter(l => l !== lang)
        : [...prev.selectedLangs, lang],
    }));
  }, []);

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to choose a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setField('photo', result.assets[0].uri);
  }, [setField]);

  const canProceed = useCallback((step: 1 | 2 | 3): boolean => {
    const f = form;
    if (step === 1) return !!(f.fullName.trim() && f.profession && f.about.trim() && f.experience);
    if (step === 2) return f.selectedLangs.length > 0 && !!f.district;
    return !!(f.phone.trim() && f.whatsapp.trim());
  }, [form]);

  const submit = useCallback(async () => {
    if (!user) { Alert.alert('Sign in required', 'Please sign in before registering as a worker.'); return; }
    setSubmitting(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const worker: Worker = {
        id:               `worker_${Date.now().toString(36)}`,
        fullName:         form.fullName.trim(),
        profilePhoto:     form.photo,
        profession:       form.profession,
        customProfession: form.profession === 'Other' ? (form.customProfession.trim() || null) : null,
        about:            form.about.trim(),
        yearsOfExperience: parseInt(form.experience) || 0,
        languages:        form.selectedLangs,
        gender:           (form.gender as Worker['gender']) ?? null,
        serviceAreas:     form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
        district:         form.district,
        phone:            form.phone.trim(),
        whatsapp:         form.whatsapp.trim(),
        price:            form.price.trim() || null,
        availability:     form.availability,
        serviceType:      form.serviceType,
        rating: 0, reviewCount: 0,
        isVerified: false, isApproved: true,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      };
      await addWorker(worker);
      Alert.alert(
        'Profile Created! 🎉',
        'Your worker profile is now live. Customers can find and contact you.',
        [{ text: 'View Profile', onPress: () => router.replace(`/worker/${worker.id}`) }],
      );
    } finally {
      setSubmitting(false);
    }
  }, [form, user, addWorker, router]);

  return { form, setField, toggleLang, pickPhoto, canProceed, submit, submitting };
}
