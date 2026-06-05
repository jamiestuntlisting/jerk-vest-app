import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

import JerkVestLogo from '@/components/JerkVestLogo';
import FeaturedHero from '@/components/FeaturedHero';
import TapeStack from '@/components/TapeStack';
import VhsPlayer from '@/components/VhsPlayer';
import { FEATURED, FOOTER_LINKS } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { colors, fonts, space } from '@/lib/theme';

type Phase = 'idle' | 'inserting' | 'watching';

export default function MenuScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const progress = useSharedValue(0);

  const startPlay = () => {
    if (phase !== 'idle') return;
    track('video_play', { label: FEATURED.youtubeId, meta: { title: FEATURED.title, area: 'hero' } });
    setPhase('inserting');
    // push the tape in right here on the home screen, then hand off to the film
    progress.value = withTiming(1, { duration: 950, easing: Easing.inOut(Easing.cubic) }, (finished) => {
      'worklet';
      if (finished) runOnJS(setPhase)('watching');
    });
  };

  const closePlay = () => {
    setPhase('idle');
    progress.value = 0; // eject — tape sits back in the open slot
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.logo}>
            <JerkVestLogo size={0.46} showProductions={false} />
          </View>

          <FeaturedHero featured={FEATURED} progress={progress} idle={phase === 'idle'} onPlay={startPlay} />

          <TapeStack />

          <View style={styles.footer}>
            {FOOTER_LINKS.map((l) => (
              <Pressable
                key={l.key}
                hitSlop={6}
                onPress={() => {
                  track('menu_click', { label: l.key, meta: { area: 'footer' } });
                  if (l.kind === 'external') void openExternal(l.target, l.key);
                  else router.push(l.target as never);
                }}>
                <Text style={styles.footerLink}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {phase === 'watching' ? <VhsPlayer youtubeId={FEATURED.youtubeId} onClose={closePlay} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: space.lg, gap: space.lg },
  logo: { alignItems: 'center' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: space.lg, rowGap: space.xs, paddingHorizontal: space.lg },
  footerLink: { fontFamily: fonts.heading, color: colors.orangeLight, letterSpacing: 2, fontSize: 13 },
});
