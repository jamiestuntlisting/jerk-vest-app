import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import JerkVestLogo from '@/components/JerkVestLogo';
import FeaturedHero from '@/components/FeaturedHero';
import MiniTape from '@/components/MiniTape';
import VhsPlayer from '@/components/VhsPlayer';
import { SpecialFeaturesBar, DvdVideoMark } from '@/components/Chrome';
import { FEATURED, SHELF, SOCIALS } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { colors, fonts, space } from '@/lib/theme';

export default function MenuScreen() {
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
            <JerkVestLogo size={0.5} showProductions={false} />
          </View>

          <FeaturedHero featured={FEATURED} onPlay={play} />

          <View style={styles.shelf}>
            <SpecialFeaturesBar />
            <View style={styles.shelfRow}>
              {SHELF.map((item) => (
                <MiniTape key={item.key} item={item} count={SHELF.length} />
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.socials}>
              {SOCIALS.map((s) => (
                <Pressable key={s.key} onPress={() => openExternal(s.url, s.key)} hitSlop={8}>
                  <Text style={styles.social}>{s.label}</Text>
                </Pressable>
              ))}
            </View>
            <DvdVideoMark />
          </View>
        </View>
      </SafeAreaView>

      {playing ? (
        <VhsPlayer youtubeId={FEATURED.youtubeId} title={FEATURED.title} onClose={() => setPlaying(false)} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.sm },
  logo: { alignItems: 'center', marginTop: space.xs, marginBottom: space.xs },
  shelf: { marginTop: space.sm },
  shelfRow: { flexDirection: 'row', justifyContent: 'space-between', gap: space.sm, marginTop: space.md },
  footer: { alignItems: 'center', gap: space.sm, marginTop: space.md },
  socials: { flexDirection: 'row', gap: space.xl },
  social: { fontFamily: fonts.heading, color: colors.orangeLight, letterSpacing: 2, fontSize: 14 },
});
