/**
 * Cross-platform shadow utility.
 *
 * On web, react-native-web prefers `boxShadow` (CSS) over the deprecated
 * `shadow*` props. On iOS/Android those props are still the right call.
 *
 * Usage in StyleSheet.create:
 *   card: { borderRadius: 16, ...shadow('md') }
 */
import { Platform } from 'react-native';

const LEVELS = {
  sm: {
    native: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    web: { boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  },
  md: {
    native: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  },
  lg: {
    native: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 6,
      elevation: 4,
    },
    web: { boxShadow: '0 2px 6px rgba(0,0,0,0.10)' },
  },
} as const;

type ShadowLevel = keyof typeof LEVELS;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shadow(level: ShadowLevel = 'md'): Record<string, any> {
  return Platform.select({
    web: LEVELS[level].web,
    default: LEVELS[level].native,
  }) ?? LEVELS[level].native;
}
