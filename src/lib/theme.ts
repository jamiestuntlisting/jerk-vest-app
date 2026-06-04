/**
 * Jerk Vest Productions — brand theme.
 * Colors and fonts mirror the original jerkvest.com site so the app, the web
 * build, and the eventual native iOS app all read as the same brand.
 */
import { Platform } from 'react-native';

export const colors = {
  // Deep backdrop range (the "midnight purple" of a DVD menu)
  black: '#06050B',
  bg0: '#0A0713',
  bg1: '#140A24',
  purpleDeep: '#1C0B33',
  purpleDark: '#3A1561',
  purple: '#6B2D8B',
  purpleMain: '#8B3FA8',
  purpleLight: '#B45FD6',
  purpleGlow: '#C06BF0',

  // Signature orange
  orange: '#FF4D2A',
  orangeLight: '#FF7A45',
  orangeDeep: '#D8350F',

  white: '#FFFFFF',
  textBright: '#F4ECFF',
  textDim: 'rgba(244,236,255,0.66)',
  textFaint: 'rgba(244,236,255,0.40)',

  line: 'rgba(180,95,214,0.45)',
  lineFaint: 'rgba(180,95,214,0.22)',
  tileBg: 'rgba(28,11,51,0.55)',
  tileBorder: 'rgba(180,95,214,0.40)',
} as const;

/**
 * Font family names. These match the families registered by @expo-google-fonts
 * in the root layout, so the same string works on web and native.
 */
export const fonts = {
  /** Heavy, slanted display face for the JERK VEST wordmark + big titles. */
  display: 'Anton_400Regular',
  /** Tall condensed caps for section headers / DVD chrome. */
  heading: 'BebasNeue_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  /** Hand-scrawled marker, for VHS tape labels. */
  marker: 'PermanentMarker_400Regular',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 36,
  xxxl: 56,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
} as const;

/** Phone-first max width so the web build still feels like an app on desktop. */
export const APP_MAX_WIDTH = 480;

/** Absolute-fill as a plain style object (spreadable, unlike StyleSheet.absoluteFill). */
export const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

/** A soft glow shadow helper that works on both web and native. */
export function glow(color: string, radius = 18, opacity = 0.9) {
  return Platform.select({
    web: { boxShadow: `0 0 ${radius}px ${rgba(color, opacity)}` } as object,
    default: {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: 0 },
      elevation: Math.round(radius / 2),
    },
  })!;
}

/** Convert a hex color to rgba() with the given alpha. */
export function rgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
