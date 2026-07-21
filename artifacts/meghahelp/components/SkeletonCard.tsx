import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

/** Animated shimmer skeleton for worker card loading state. */
export function SkeletonCard() {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  const shimmer = colors.muted;

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.card, opacity }]}>
      <View style={[styles.avatar, { backgroundColor: shimmer }]} />
      <View style={styles.content}>
        <View style={[styles.line, { backgroundColor: shimmer, width: '60%' }]} />
        <View style={[styles.line, { backgroundColor: shimmer, width: '40%', marginTop: 8 }]} />
        <View style={[styles.line, { backgroundColor: shimmer, width: '75%', marginTop: 8 }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    height: 12,
    borderRadius: 6,
  },
});
