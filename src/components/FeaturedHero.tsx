/**
 * The home's focal point: the featured film seated in a VCR as a VHS. The tape
 * wiggles to invite a tap; tapping plays the insert in place (driven by the
 * shared `progress`) and then the home hands off to the film.
 */
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import VcrScene from '@/components/VcrScene';
import { APP_MAX_WIDTH, colors, fonts, glow } from '@/lib/theme';

export default function FeaturedHero({
  featured,
  progress,
  idle,
  onPlay,
}: {
  featured: { title: string; ribbon: string; accent: string };
  progress: SharedValue<number>;
  idle: boolean;
  onPlay: () => void;
}) {
  const { width } = useWindowDimensions();
  const vcrW = Math.min(width, APP_MAX_WIDTH);

  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>NOW PLAYING</Text>

      <Pressable onPress={onPlay} disabled={!idle} accessibilityRole="button" accessibilityLabel={`Play ${featured.title}`} style={glow(colors.orange, 28, 0.26)}>
        <VcrScene width={vcrW} title={featured.title} accent={featured.accent} ribbon={featured.ribbon} progress={progress} wiggle={idle} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  eyebrow: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 6, fontSize: 14, marginBottom: 16, ...glow(colors.purpleGlow, 8, 0.5) },
});
