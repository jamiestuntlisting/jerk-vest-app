/**
 * The rest of the catalog — each other video as a VHS tape (the same shape as
 * the featured Dodge Brick tape, just rotated 90° to stand upright), sitting on
 * a wood shelf. Tap a tape to open that project.
 */
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import VhsTape from '@/components/VhsTape';
import { CATALOG } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { APP_MAX_WIDTH, colors, fonts, fill, glow, rgba, space } from '@/lib/theme';

/** The featured-tape graphic, rotated a quarter-turn so it stands on its end. */
function StandingTape({ title, accent, length }: { title: string; accent: string; length: number }) {
  const thick = length * 0.34;
  return (
    <View style={{ width: thick, height: length, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ rotate: '90deg' }] }}>
        <VhsTape title={title} width={length} accent={accent} />
      </View>
    </View>
  );
}

function WoodShelf({ width }: { width: number }) {
  return (
    <View style={[styles.shelf, { width }]}>
      <LinearGradient colors={['#7c5a37', '#4c3420']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={fill} />
      <View style={styles.shelfTop} />
      <View style={[styles.grain, { top: '42%' }]} />
      <View style={[styles.grain, { top: '68%', left: '10%', right: '14%' }]} />
      <View style={styles.shelfFoot} />
    </View>
  );
}

export default function TapeStack() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cap = Math.min(width, APP_MAX_WIDTH);
  const length = cap * 0.46;
  const shelfW = cap * 0.82;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>MORE TAPES</Text>
      <View style={styles.stage}>
        <View style={styles.row}>
          {CATALOG.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => {
                track('menu_click', { label: t.key, meta: { area: 'catalog' } });
                if (t.kind === 'external') void openExternal(t.target, t.key);
                else router.push(t.target as never);
              }}
              style={({ pressed }) => [styles.tapeShadow, pressed && { opacity: 0.6, transform: [{ translateY: 1 }] }]}
              accessibilityRole="button"
              accessibilityLabel={t.title}>
              <StandingTape title={t.title} accent={t.accent} length={length} />
            </Pressable>
          ))}
        </View>
        <WoodShelf width={shelfW} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.sm },
  heading: { fontFamily: fonts.heading, color: colors.textDim, letterSpacing: 5, fontSize: 12 },
  stage: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: space.xl, zIndex: 1 },
  tapeShadow: { ...glow(colors.black, 10, 0.55) },
  shelf: { height: 26, borderRadius: 3, overflow: 'hidden', marginTop: -3, ...glow(colors.black, 14, 0.5) },
  shelfTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: rgba('#9a7048', 0.9) },
  grain: { position: 'absolute', left: '6%', right: '8%', height: 1, backgroundColor: rgba(colors.black, 0.22) },
  shelfFoot: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: rgba(colors.black, 0.45) },
});
