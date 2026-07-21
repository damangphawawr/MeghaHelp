import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface AvatarProps {
  name: string;
  photo: string | null;
  size?: number;
}

/** Shows a profile photo or initials fallback with the brand primary color. */
export function Avatar({ name, photo, size = 48 }: AvatarProps) {
  const colors = useColors();
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary + '20',
        },
      ]}
    >
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <Text style={[styles.initials, { color: colors.primary, fontSize: size * 0.36 }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontFamily: 'Inter_700Bold',
  },
});
