/**
 * The home's focal point: the featured film seated in a VCR as a VHS. The tape
 * wiggles to invite a tap; tapping plays the insert in place. When the deck is
 * empty (tape ejected) it prompts to load one instead.
 */
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import VcrScene from '@/components/VcrScene';
import type { Tape } from '@/lib/content';
import { APP_MAX_WIDTH, colors, fonts, glow } from '@/lib/theme';

export default function FeaturedHero({
  featured,
  progress,
  idle,
  onPlay,
  onEject,
  slotRef,
  hideTape,
}: {
  featured: Tape | null;
  progress: SharedValue<number>;
  idle: boolean;
  onPlay: () => void;
  onEject: () => void;
  slotRef: (node: View | null) => void;
  hideTape: boolean;
}) {
  const { width } = useWindowDimensions();
  const vcrW = Math.min(width, APP_MAX_WIDTH);
  const hasTape = !!featured;

  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>{hasTape ? 'NOW PLAYING' : 'INSERT A TAPE'}</Text>

      <View style={glow(colors.orange, 28, 0.26)}>
        <VcrScene
          width={vcrW}
          title={featured?.title ?? ''}
          accent={featured?.accent ?? colors.orange}
          ribbon={featured?.ribbon}
          progress={progress}
          wiggle={idle && hasTape}
          slotRef={slotRef}
          hideTape={hideTape}
          hasTape={hasTape}
          onPlay={onPlay}
          canPlay={idle && hasTape}
          onEject={onEject}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  eyebrow: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 6, fontSize: 14, marginBottom: 16, ...glow(colors.purpleGlow, 8, 0.5) },
});

