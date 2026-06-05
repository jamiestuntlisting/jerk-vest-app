/**
 * The rest of the catalog — each other video as its own VHS tape, stacked
 * vertically below the VCR. Tap a tape to open that project.
 */
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import VhsTape from '@/components/VhsTape';
import { CATALOG } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { APP_MAX_WIDTH, colors, fonts, space } from '@/lib/theme';

export default function TapeStack() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tapeW = Math.min(width, APP_MAX_WIDTH) * 0.5; // same width as the featured tape

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>MORE TAPES</Text>
      {CATALOG.map((t) => (
        <Pressable
          key={t.key}
          onPress={() => {
            track('menu_click', { label: t.key, meta: { area: 'catalog' } });
            if (t.kind === 'external') void openExternal(t.target, t.key);
            else router.push(t.target as never);
          }}
          style={({ pressed }) => [pressed && { opacity: 0.6, transform: [{ translateY: 1 }] }]}
          accessibilityRole="button"
          accessibilityLabel={t.title}>
          <VhsTape title={t.title} width={tapeW} accent={t.accent} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.sm },
  heading: { fontFamily: fonts.heading, color: colors.textDim, letterSpacing: 5, fontSize: 12, marginBottom: space.xs },
});
