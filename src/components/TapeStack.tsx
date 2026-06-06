/**
 * The shelf — a fixed slot for every tape, standing upright on a wood shelf
 * (the featured-tape graphic rotated a quarter-turn). A tape's slot is empty
 * (a faint ghost) while it's in the VCR or mid-flight. Tapping a tape reports
 * its key so the home can fly it into the deck.
 */
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import VhsTape from '@/components/VhsTape';
import type { Tape } from '@/lib/content';
import { APP_MAX_WIDTH, colors, fonts, fill, glow, rgba, space } from '@/lib/theme';

export type Rect = { x: number; y: number; width: number; height: number };

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

export default function TapeStack({
  tapes,
  emptyKeys,
  onPressTape,
  onSlotRef,
}: {
  tapes: Tape[];
  emptyKeys: string[];
  onPressTape: (key: string) => void;
  onSlotRef: (key: string, node: View | null) => void;
}) {
  const { width } = useWindowDimensions();
  const cap = Math.min(width, APP_MAX_WIDTH);
  const length = cap * 0.46;
  const thick = length * 0.34;
  const shelfW = cap * 0.86;
  const heading = emptyKeys.length === 0 ? 'PICK A TAPE' : 'MORE TAPES';

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.stage}>
        <View style={styles.row}>
          {tapes.map((t) => {
            const empty = emptyKeys.includes(t.key);
            return (
              <View key={t.key} ref={(n) => onSlotRef(t.key, n)} style={{ width: thick, height: length }}>
                {empty ? (
                  <View style={[styles.ghost, { borderRadius: thick * 0.14 }]} />
                ) : (
                  <Pressable
                    onPress={() => onPressTape(t.key)}
                    style={({ pressed }) => [styles.tapeShadow, pressed && { opacity: 0.6, transform: [{ translateY: 1 }] }]}
                    accessibilityRole="button"
                    accessibilityLabel={t.title}>
                    <StandingTape title={t.title} accent={t.accent} length={length} />
                  </Pressable>
                )}
              </View>
            );
          })}
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
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: space.lg, zIndex: 1 },
  ghost: { flex: 1, borderWidth: 1, borderColor: rgba(colors.white, 0.08), backgroundColor: rgba(colors.black, 0.18) },
  tapeShadow: { ...glow(colors.black, 10, 0.55) },
  shelf: { height: 26, borderRadius: 3, overflow: 'hidden', marginTop: -3, ...glow(colors.black, 14, 0.5) },
  shelfTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: rgba('#9a7048', 0.9) },
  grain: { position: 'absolute', left: '6%', right: '8%', height: 1, backgroundColor: rgba(colors.black, 0.22) },
  shelfFoot: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: rgba(colors.black, 0.45) },
});
