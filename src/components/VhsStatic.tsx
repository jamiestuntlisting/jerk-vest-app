/**
 * Full-screen VHS static + tracking distortion, used during the tape-insert
 * transition before the film starts. Real noise on web (SVG turbulence),
 * plus a rolling "tracking" band and glitch lines on every platform.
 */
import { createElement, useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, fill, rgba } from '@/lib/theme';

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>\")";

function WebNoise() {
  return createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: NOISE,
      backgroundSize: '160px',
      opacity: 0.3,
      mixBlendMode: 'screen',
      animation: 'jv-noise 0.5s steps(4) infinite',
      pointerEvents: 'none',
    },
  });
}

export default function VhsStatic() {
  const { height } = useWindowDimensions();
  const roll = useSharedValue(0);

  useEffect(() => {
    roll.value = withRepeat(withTiming(1, { duration: 1700, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(roll);
  }, [roll]);

  const band = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(roll.value, [0, 1], [-height * 0.15, height * 1.05]) }],
  }));

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.base} />
      {Platform.OS === 'web' ? <WebNoise /> : null}

      {/* fixed glitch lines */}
      <View style={[styles.glitch, { top: '22%', opacity: 0.1 }]} />
      <View style={[styles.glitch, { top: '58%', opacity: 0.08, height: 3 }]} />
      <View style={[styles.glitch, { top: '77%', opacity: 0.12 }]} />

      {/* rolling tracking band */}
      <Animated.View style={[styles.trackBand, band]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...fill, overflow: 'hidden' },
  base: { ...fill, backgroundColor: '#070a12' },
  glitch: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: rgba(colors.white, 1) },
  trackBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: rgba(colors.white, 0.06),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: rgba(colors.white, 0.12),
  },
});
