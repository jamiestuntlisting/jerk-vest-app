/**
 * The JERK VEST wordmark, rebuilt as live type so it can move.
 * - orange skewed display letters with depth shadow + glow
 * - purple "speed lines" behind the words (echoing the original logo)
 * - a metallic shine that sweeps across on a loop
 * - a subtle "breathing" scale so it never feels static
 */
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

import { colors, fonts, fill, rgba } from '@/lib/theme';

export default function JerkVestLogo({ size = 1, showProductions = true }: { size?: number; showProductions?: boolean }) {
  const reduced = !!useReducedMotion();
  const sweep = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    sweep.value = withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.quad) }), -1, false);
    breathe.value = withRepeat(withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => {
      cancelAnimation(sweep);
      cancelAnimation(breathe);
    };
  }, [sweep, breathe, reduced]);

  const wordSize = 92 * size;
  const lineW = 220 * size;

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduced ? 1 : interpolate(breathe.value, [0, 1], [1, 1.035]) }],
  }));

  const shineStyle = useAnimatedStyle(() => {
    const p = sweep.value;
    return {
      transform: [{ translateX: interpolate(p, [0, 1], [-lineW * 1.4, lineW * 1.4]) }, { rotateZ: '18deg' }],
      opacity: interpolate(p, [0, 0.12, 0.4, 0.6, 1], [0, 0.9, 0.7, 0, 0]),
    };
  });

  const word = (text: string, extra?: object) => (
    <Text
      style={[
        styles.word,
        {
          fontSize: wordSize,
          lineHeight: wordSize * 1.02,
          textShadowColor: rgba(colors.orangeDeep, 0.9),
        },
        extra,
      ]}>
      {text}
    </Text>
  );

  return (
    <Animated.View style={[styles.wrap, breatheStyle]}>
      {/* speed lines */}
      <View style={[styles.speedLines, { width: lineW }]} pointerEvents="none">
        {[0.4, 0.7, 1, 0.55, 0.8].map((w, i) => (
          <View
            key={i}
            style={{
              height: 3 * size,
              width: lineW * w,
              backgroundColor: rgba(i % 2 ? colors.purpleLight : colors.purple, 0.55),
              borderRadius: 3,
              marginVertical: 3 * size,
              transform: [{ skewX: '-14deg' }],
            }}
          />
        ))}
      </View>

      <View style={styles.words}>
        {word('JERK', { marginLeft: -8 * size })}
        {word('VEST', { marginTop: -wordSize * 0.28, marginLeft: 18 * size })}

        {/* shine sweep, clipped to the wordmark box */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.shineClip}>
            <Animated.View style={[styles.shine, shineStyle]}>
              <LinearGradient
                colors={['transparent', rgba(colors.white, 0.85), 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        </View>
      </View>

      {showProductions ? (
        <Text style={[styles.productions, { fontSize: 22 * size }]}>P R O D U C T I O N S</Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  speedLines: { position: 'absolute', top: '6%', left: 0, opacity: 0.8 },
  words: { alignItems: 'center', overflow: 'hidden', paddingHorizontal: 6 },
  word: {
    fontFamily: fonts.display,
    color: colors.orange,
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 14,
    transform: [{ skewX: '-10deg' }],
    ...Platform.select({ web: { textTransform: 'none' } }),
  },
  shineClip: { ...fill, overflow: 'hidden' },
  shine: {
    position: 'absolute',
    top: '-40%',
    height: '180%',
    width: 60,
    ...Platform.select({ web: { mixBlendMode: 'screen' } as object, default: {} }),
  },
  productions: {
    fontFamily: fonts.heading,
    color: colors.orangeLight,
    letterSpacing: 6,
    marginTop: 4,
    transform: [{ skewX: '-8deg' }],
  },
});
