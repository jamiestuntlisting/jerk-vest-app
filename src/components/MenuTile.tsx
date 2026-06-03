/**
 * A full-width DVD-menu tile in the mockup style: image (or headshots /
 * monogram) on the left, heavy italic orange title, light all-caps description,
 * orange play arrow. Full width gives the title + description room to be big and
 * never truncated. The menu cycles an orange highlight through the tiles.
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

function ImageArea({ item }: { item: MenuItem }) {
  if (item.avatars?.length) {
    return (
      <View style={styles.avatars}>
        {item.avatars.map((a, i) => {
          const accent = a.accent === 'orange' ? colors.orange : colors.purpleLight;
          return (
            <View
              key={a.initials}
              style={[styles.avatar, { borderColor: accent, marginLeft: i > 0 ? -22 : 0, zIndex: item.avatars!.length - i }]}>
              {a.url ? (
                <Image source={{ uri: a.url }} style={fill} contentFit="cover" transition={200} />
              ) : (
                <Text style={[styles.avatarText, { color: accent }]}>{a.initials}</Text>
              )}
            </View>
          );
        })}
      </View>
    );
  }
  if (item.monoText || !item.thumb) {
    return (
      <View style={styles.imageInner}>
        <LinearGradient colors={[colors.purpleDark, colors.purpleDeep]} style={fill} />
        <Text style={styles.monogram}>{item.monoText ?? 'JV'}</Text>
      </View>
    );
  }
  return (
    <View style={styles.imageInner}>
      <Image source={{ uri: item.thumb }} style={fill} contentFit="cover" transition={250} cachePolicy="memory-disk" />
      <LinearGradient colors={[rgba(colors.purpleDeep, 0.2), rgba(colors.purple, 0.55)]} style={fill} />
      <View style={styles.gloss} />
    </View>
  );
}

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
    enter.value = withDelay(120 + index * 80, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
  }, [enter, index]);

  useEffect(() => {
    act.value = withTiming(active ? 1 : 0, { duration: 420, easing: Easing.inOut(Easing.quad) });
  }, [act, active]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: interpolate(enter.value, [0, 1], [16, 0]) },
      { scale: interpolate(act.value, [0, 1], [1, 1.02]) - interpolate(press.value, [0, 1], [0, 0.025]) },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: act.value }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(act.value, [0, 1], [0, 6]) }],
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
        <View style={styles.imageWrap}>
          <ImageArea item={item} />
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.blurb}>{item.blurb}</Text>
        </View>

        <Animated.View style={[styles.arrowWrap, arrowStyle]}>
          <View style={styles.arrow} />
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.activeBorder, glowStyle]} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: { width: '100%' },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.tileBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    padding: 11,
    overflow: 'hidden',
    minHeight: 104,
  },
  imageWrap: { width: 104, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  imageInner: {
    ...fill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purpleDeep,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.35),
  },
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '42%', backgroundColor: rgba(colors.white, 0.08) },
  monogram: { fontFamily: fonts.display, color: rgba(colors.orange, 0.9), fontSize: 38, transform: [{ skewX: '-8deg' }] },
  avatars: { ...fill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...glow(colors.purpleDark, 8, 0.5),
  },
  avatarText: { fontFamily: fonts.display, fontSize: 24 },
  body: { flex: 1, paddingHorizontal: 14, justifyContent: 'center', paddingVertical: 4 },
  title: {
    fontFamily: fonts.display,
    color: colors.orange,
    fontSize: 30,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    transform: [{ skewX: '-9deg' }],
    marginBottom: 5,
    ...glow(colors.orangeDeep, 8, 0.35),
  },
  blurb: {
    fontFamily: fonts.bodyMedium,
    color: colors.textBright,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    transform: [{ skewX: '-4deg' }],
  },
  arrowWrap: { alignSelf: 'center', paddingLeft: 8, paddingRight: 2 },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 18,
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
