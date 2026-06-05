import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
        <View style={styles.container}>
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
        </View>
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
  container: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.sm },
  logo: { alignItems: 'center', marginTop: space.xs, marginBottom: space.xs },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: space.lg, rowGap: space.xs, marginTop: space.md },
  footerLink: { fontFamily: fonts.heading, color: colors.orangeLight, letterSpacing: 2, fontSize: 13 },
});
