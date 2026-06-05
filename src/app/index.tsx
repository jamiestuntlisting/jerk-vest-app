import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import JerkVestLogo from '@/components/JerkVestLogo';
import FeaturedHero from '@/components/FeaturedHero';
import TapeStack from '@/components/TapeStack';
import VhsPlayer from '@/components/VhsPlayer';
import { FEATURED, FOOTER_LINKS } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { colors, fonts, space } from '@/lib/theme';

export default function MenuScreen() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  const play = () => {
    track('video_play', { label: FEATURED.youtubeId, meta: { title: FEATURED.title, area: 'hero' } });
    setPlaying(true);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.logo}>
            <JerkVestLogo size={0.46} showProductions={false} />
          </View>

          <FeaturedHero featured={FEATURED} onPlay={play} />

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

      {playing ? (
        <VhsPlayer youtubeId={FEATURED.youtubeId} title={FEATURED.title} accent={FEATURED.accent} onClose={() => setPlaying(false)} />
      ) : null}
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
