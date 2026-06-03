/**
 * A single DVD-menu feature tile: thumbnail + title + blurb + play arrow.
 * When it is the "active" tile (the menu cycles a highlight through them like
 * a DVD remote selection) it lifts, its border glows orange, and the arrow
 * nudges — so something is always quietly drawing the eye.
 */
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import type { MenuItem } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { colors, fonts, glow, fill, rgba, space } from '@/lib/theme';

export default function MenuTile({
  item,
  index,
  active,
}: {
  item: MenuItem;
  index: number;
  active: boolean;
}) {
  const router = useRouter();
  const enter = useSharedValue(0);
  const act = useSharedValue(0);
  const press = useSharedValue(0);

  useEffect(() => {
    enter.value = withDelay(120 + index * 90, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
  }, [enter, index]);

  useEffect(() => {
    act.value = withTiming(active ? 1 : 0, { duration: 420, easing: Easing.inOut(Easing.quad) });
  }, [act, active]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: interpolate(enter.value, [0, 1], [18, 0]) },
      { scale: interpolate(act.value, [0, 1], [1, 1.035]) - interpolate(press.value, [0, 1], [0, 0.04]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: act.value }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(act.value, [0, 1], [0, 4]) }],
    opacity: interpolate(act.value, [0, 1], [0.8, 1]),
  }));

  const onPress = () => {
    if (item.kind === 'external') {
      track('menu_click', { label: item.key, meta: { kind: 'external' } });
      void openExternal(item.target, item.key);
    } else {
      track('menu_click', { label: item.key, meta: { kind: 'route' } });
      router.push(item.target as never);
    }
  };

  return (
    <Animated.View style={[styles.cell, cardStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (press.value = withTiming(1, { duration: 90 }))}
        onPressOut={() => (press.value = withTiming(0, { duration: 160 }))}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.blurb}`}
        style={styles.card}>
        {/* thumbnail */}
        <View style={styles.thumbWrap}>
          <Image source={{ uri: item.thumb }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} cachePolicy="memory-disk" />
          <LinearGradient
            colors={[rgba(colors.purpleDeep, 0.25), rgba(colors.purple, 0.65)]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.thumbGloss} />
        </View>

        {/* text */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title.toUpperCase()}
          </Text>
          <Text style={styles.blurb} numberOfLines={4}>
            {item.blurb}
          </Text>
        </View>

        {/* arrow */}
        <Animated.View style={[styles.arrowWrap, arrowStyle]}>
          <View style={styles.arrow} />
        </Animated.View>

        {/* active glow border */}
        <Animated.View pointerEvents="none" style={[styles.activeBorder, glowStyle]} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: { width: '48%', marginBottom: space.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tileBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    padding: 7,
    overflow: 'hidden',
    minHeight: 92,
  },
  thumbWrap: {
    width: 58,
    height: 72,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: colors.purpleDeep,
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.35),
  },
  thumbGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: rgba(colors.white, 0.08),
  },
  body: { flex: 1, paddingHorizontal: 8, justifyContent: 'center' },
  title: { fontFamily: fonts.heading, color: colors.orange, fontSize: 17, letterSpacing: 1, marginBottom: 3 },
  blurb: { fontFamily: fonts.body, color: colors.textDim, fontSize: 9.5, lineHeight: 12.5 },
  arrowWrap: { paddingRight: 2, paddingLeft: 2 },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.orange,
  },
  activeBorder: {
    ...fill,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.orange,
    ...glow(colors.orange, 14, 0.65),
  },
});
