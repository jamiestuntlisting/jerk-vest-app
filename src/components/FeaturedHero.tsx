/**
 * The home's focal point: the featured film as a big VHS tape with a
 * "JUST DROPPED" ribbon, a breathing glow, and a pulsing PRESS PLAY prompt.
 * It is the only thing on the home that animates for attention.
 */
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import VhsTape from '@/components/VhsTape';
import { colors, fonts, glow, rgba } from '@/lib/theme';

export default function FeaturedHero({
  featured,
  onPlay,
}: {
  featured: { title: string; ribbon: string; tagline: string };
  onPlay: () => void;
}) {
  const { width } = useWindowDimensions();
  const reduced = !!useReducedMotion();
  const breathe = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    breathe.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
    pulse.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), -1, true);
    return () => {
      cancelAnimation(breathe);
      cancelAnimation(pulse);
    };
  }, [breathe, pulse, reduced]);

  const tapeW = Math.min(width * 0.78, 300);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduced ? 1 : interpolate(breathe.value, [0, 1], [1, 1.035]) }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: reduced ? 1 : interpolate(pulse.value, [0, 1], [0.85, 1]),
    transform: [{ scale: reduced ? 1 : interpolate(pulse.value, [0, 1], [1, 1.04]) }],
  }));

  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>NOW PLAYING</Text>

      <Pressable onPress={onPlay} style={styles.press} accessibilityRole="button" accessibilityLabel={`Play ${featured.title}`}>
        <Animated.View style={[styles.tapeWrap, breatheStyle, glow(colors.orange, 26, 0.35)]}>
          <VhsTape title={featured.title} width={tapeW} />
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>{featured.ribbon}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.playPill, pulseStyle]}>
          <View style={styles.playTri} />
          <Text style={styles.playText}>PRESS PLAY</Text>
        </Animated.View>

        <Text style={styles.hint}>Insert tape to watch · {featured.tagline}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  eyebrow: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 6, fontSize: 14, marginBottom: 14, ...glow(colors.purpleGlow, 8, 0.5) },
  press: { alignItems: 'center' },
  tapeWrap: { borderRadius: 14 },
  ribbon: {
    position: 'absolute',
    top: 8,
    left: -6,
    backgroundColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    transform: [{ rotate: '-7deg' }],
    ...glow(colors.orange, 12, 0.7),
  },
  ribbonText: { fontFamily: fonts.heading, color: colors.white, letterSpacing: 2, fontSize: 14 },
  playPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 30,
    backgroundColor: colors.orange,
    ...glow(colors.orange, 20, 0.8),
  },
  playTri: {
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  playText: { fontFamily: fonts.heading, color: colors.white, letterSpacing: 3, fontSize: 22 },
  hint: { fontFamily: fonts.bodyMedium, color: colors.textDim, fontSize: 12.5, marginTop: 12, textTransform: 'uppercase', letterSpacing: 1 },
});
