/**
 * ContactButtons — call + WhatsApp action buttons with login gate.
 *
 * When the user is not logged in, shows a single CTA to sign in instead
 * of revealing the worker's phone number.
 */
import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Button } from '@/components/ui/Button';

interface ContactButtonsProps {
  phone: string;
  whatsapp: string;
  isLoggedIn: boolean;
}

export function ContactButtons({ phone, whatsapp, isLoggedIn }: ContactButtonsProps) {
  const colors = useColors();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View style={styles.wrapper}>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={() => router.push('/auth/login')}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.primary} />}
          accessibilityLabel="Sign in to view contact details"
          accessibilityHint="Opens the sign-in screen"
        >
          Sign in to view contact details
        </Button>
      </View>
    );
  }

  const handleCall = () =>
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);

  const handleWhatsApp = () => {
    const num = whatsapp.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${num}`);
  };

  return (
    <View style={styles.wrapper}>
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={handleCall}
        leftIcon={<Ionicons name="call" size={20} color={colors.primaryForeground} />}
        accessibilityLabel={`Call ${phone}`}
        accessibilityHint="Opens your phone dialler"
      >
        {phone}
      </Button>
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={handleWhatsApp}
        leftIcon={<Ionicons name="logo-whatsapp" size={20} color="#fff" />}
        accessibilityLabel={`WhatsApp ${whatsapp}`}
        accessibilityHint="Opens WhatsApp"
        style={{ backgroundColor: colors.whatsapp }}
      >
        {whatsapp}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, gap: 10 },
});
