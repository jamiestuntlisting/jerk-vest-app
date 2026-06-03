/**
 * A single DVD-menu feature tile: thumbnail + title + blurb + play arrow.
 * Stretches to fill its grid cell so the six tiles fill the screen. When it is
 * the "active" tile (the menu cycles a highlight through them like a DVD remote
 * selection) it lifts, its border glows orange, and the arrow nudges.
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
import { colors, fonts, glow, fill, rgba } from '@/lib/theme';

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
      { scale: interpolate(act.value, [0, 1], [1, 1.03]) - interpolate(press.value, [0, 1], [0, 0.04]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: act.value }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(act.value, [0, 1], [0, 5]) }],
    opacity: interpolate(act.value, [0, 1], [0.85, 1]),
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
        {/* thumbnail (or JV monogram when there's no image) */}
        <View style={styles.thumbWrap}>
          {item.thumb ? (
            <>
              <Image source={{ uri: item.thumb }} style={fill} contentFit="cover" transition={250} cachePolicy="memory-disk" />
              <LinearGradient colors={[rgba(colors.purpleDeep, 0.25), rgba(colors.purple, 0.65)]} style={fill} />
            </>
          ) : (
            <>
              <LinearGradient colors={[colors.purpleDark, colors.purpleDeep]} style={fill} />
              <Text style={styles.monogram}>JV</Text>
            </>
          )}
          <View style={styles.thumbGloss} />
        </View>

        {/* text */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {item.title.toUpperCase()}
          </Text>
          <Text style={styles.blurb} numberOfLines={3}>
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
  cell: { flex: 1 },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.tileBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    padding: 9,
    overflow: 'hidden',
  },
  thumbWrap: {
    width: '33%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.purpleDeep,
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: { fontFamily: fonts.display, color: rgba(colors.orange, 0.85), fontSize: 32, transform: [{ skewX: '-8deg' }] },
  thumbGloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '42%', backgroundColor: rgba(colors.white, 0.08) },
  body: { flex: 1, paddingHorizontal: 10, justifyContent: 'center' },
  title: { fontFamily: fonts.heading, color: colors.orange, fontSize: 27, letterSpacing: 1, marginBottom: 4 },
  blurb: { fontFamily: fonts.body, color: colors.textBright, fontSize: 14, lineHeight: 18 },
  arrowWrap: { alignSelf: 'center', paddingHorizontal: 4 },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.orange,
  },
  activeBorder: {
    ...fill,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.orange,
    ...glow(colors.orange, 16, 0.7),
  },
});
