/**
 * A small "shelf" tape — the secondary, deliberately quiet options under the
 * hero. Tapping routes internally or opens an external link.
 */
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import VhsTape from '@/components/VhsTape';
import type { ShelfItem } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { colors, fonts, space } from '@/lib/theme';

export default function MiniTape({ item, count }: { item: ShelfItem; count: number }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const colW = Math.min(width, 480) - space.lg * 2;
  const tapeW = (colW - space.sm * (count - 1)) / count;

  const onPress = () => {
    track('menu_click', { label: item.key, meta: { kind: item.kind, area: 'shelf' } });
    if (item.kind === 'external') void openExternal(item.target, item.key);
    else router.push(item.target as never);
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, { width: tapeW }, pressed && { opacity: 0.6 }]} accessibilityRole="button" accessibilityLabel={item.title}>
      <VhsTape title={item.title} width={tapeW} compact accent={colors.purpleLight} />
      <Text style={styles.caption} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  caption: { fontFamily: fonts.heading, color: colors.textDim, letterSpacing: 1.5, fontSize: 12, marginTop: 5 },
});
