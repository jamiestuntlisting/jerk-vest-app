/**
 * The living DVD-menu background.
 *
 * Layers (back to front):
 *   1. Deep gradient base
 *   2. Optional looping muted video (only if EXPO_PUBLIC_BG_VIDEO_URL is set)
 *   3. Three drifting + breathing colour blooms (orange / purple / magenta)
 *   4. Slow diagonal "speed line" streaks echoing the logo
 *   5. A dark scrim so foreground text stays readable
 *
 * It moves and slowly changes but never pulls focus — exactly what a DVD
 * attract-loop background should do. On native this provides all the motion;
 * on web it sits under the CSS scanline/vignette layer from global.css.
 */
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VideoView, useVideoPlayer } from 'expo-video';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, rgba } from '@/lib/theme';

const BG_VIDEO = process.env.EXPO_PUBLIC_BG_VIDEO_URL;

function Bloom({
  progress,
  color,
  size,
  base,
  drift,
  reduced,
}: {
  progress: SharedValue<number>;
  color: string;
  size: number;
  base: { top: number; left: number };
  drift: { x: number[]; y: number[]; scale: number[] };
  reduced: boolean;
}) {
  const style = useAnimatedStyle(() => {
    if (reduced) return {};
    const stops = [0, 0.25, 0.5, 0.75, 1];
    return {
      transform: [
        { translateX: interpolate(progress.value, stops, drift.x) },
        { translateY: interpolate(progress.value, stops, drift.y) },
        { scale: interpolate(progress.value, [0, 0.5, 1], drift.scale) },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: base.top,
          left: base.left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: rgba(color, Platform.OS === 'web' ? 0.42 : 0.3),
          // Soft radial falloff. boxShadow gives a clean bloom on web.
          ...Platform.select({
            web: { boxShadow: `0 0 ${size * 0.75}px ${size * 0.35}px ${rgba(color, 0.45)}` },
            default: {
              shadowColor: color,
              shadowOpacity: 0.7,
              shadowRadius: size * 0.5,
              shadowOffset: { width: 0, height: 0 },
            },
          }),
        },
        style,
      ]}
    />
  );
}

function SpeedLine({
  progress,
  width,
  travel,
  top,
  thickness,
  color,
  phase,
  reduced,
}: {
  progress: SharedValue<number>;
  width: number;
  travel: number;
  top: number;
  thickness: number;
  color: string;
  phase: number;
  reduced: boolean;
}) {
  const style = useAnimatedStyle(() => {
    if (reduced) return { opacity: 0.12 };
    const p = (progress.value + phase) % 1;
    return {
      transform: [{ translateX: interpolate(p, [0, 1], [-width, travel]) }, { rotateZ: '-12deg' }],
      opacity: interpolate(p, [0, 0.15, 0.85, 1], [0, 0.5, 0.5, 0]),
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top,
          left: 0,
          height: thickness,
          width: width * 0.7,
          borderRadius: thickness,
          backgroundColor: color,
        },
        Platform.OS === 'web' ? { filter: `blur(1px)` } : null,
        style,
      ]}
    />
  );
}

function BackgroundVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      pointerEvents="none"
    />
  );
}

export default function BackgroundFX() {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const reduced = !!reducedMotion;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 26000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(progress);
  }, [progress, reduced]);

  const big = Math.max(width, height);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[colors.bg0, colors.purpleDeep, colors.bg0, colors.black]}
        locations={[0, 0.4, 0.75, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {BG_VIDEO ? (
        <View style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}>
          <BackgroundVideo uri={BG_VIDEO} />
        </View>
      ) : null}

      <Bloom
        progress={progress}
        color={colors.purpleMain}
        size={big * 0.9}
        base={{ top: -big * 0.2, left: -big * 0.25 }}
        drift={{ x: [0, 60, 20, -40, 0], y: [0, -40, 30, 50, 0], scale: [1, 1.25, 1] }}
        reduced={reduced}
      />
      <Bloom
        progress={progress}
        color={colors.orange}
        size={big * 0.7}
        base={{ top: height * 0.45, left: width * 0.35 }}
        drift={{ x: [0, -50, 30, 10, 0], y: [0, 30, -20, -50, 0], scale: [1, 1.15, 0.95] }}
        reduced={reduced}
      />
      <Bloom
        progress={progress}
        color={colors.purpleGlow}
        size={big * 0.6}
        base={{ top: height * 0.1, left: width * 0.5 }}
        drift={{ x: [0, 30, -40, 20, 0], y: [0, 50, 20, -30, 0], scale: [0.95, 1.2, 1] }}
        reduced={reduced}
      />

      <SpeedLine progress={progress} width={width} travel={width * 1.4} top={height * 0.18} thickness={3} color={rgba(colors.orange, 0.6)} phase={0} reduced={reduced} />
      <SpeedLine progress={progress} width={width} travel={width * 1.4} top={height * 0.3} thickness={2} color={rgba(colors.purpleLight, 0.5)} phase={0.35} reduced={reduced} />
      <SpeedLine progress={progress} width={width} travel={width * 1.4} top={height * 0.62} thickness={4} color={rgba(colors.orange, 0.45)} phase={0.6} reduced={reduced} />
      <SpeedLine progress={progress} width={width} travel={width * 1.4} top={height * 0.8} thickness={2} color={rgba(colors.purpleLight, 0.45)} phase={0.85} reduced={reduced} />

      {/* readability scrim */}
      <LinearGradient
        colors={[rgba(colors.black, 0.2), rgba(colors.black, 0.55), rgba(colors.black, 0.8)]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
