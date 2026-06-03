import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';

import JerkVestLogo from '@/components/JerkVestLogo';
import MenuTile from '@/components/MenuTile';
import { SpecialFeaturesBar, DvdVideoMark } from '@/components/Chrome';
import { MENU, INSTAGRAM_LINK } from '@/lib/content';
import { openExternal } from '@/lib/links';
import { colors, fonts, glow, rgba, space } from '@/lib/theme';

export default function MenuScreen() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);

  // Cycle the highlight through the tiles like a DVD remote selection.
  useEffect(() => {
    if (reduced) {
      setActive(-1);
      return;
    }
    const id = setInterval(() => setActive((i) => (i + 1) % MENU.length), 1900);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Whole menu fits one screen — no ScrollView. The grid flexes to fill. */}
      <View style={styles.container}>
        <SpecialFeaturesBar />

        <View style={styles.logo}>
          <JerkVestLogo size={0.58} />
        </View>

        <View style={styles.grid}>
          {MENU.map((item, i) => (
            <MenuTile key={item.key} item={item} index={i} active={active === i} />
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() => openExternal(INSTAGRAM_LINK.url, 'instagram')}
            style={({ pressed }) => [styles.ig, pressed && { opacity: 0.85 }]}>
            <Text style={styles.igGlyph}>◉</Text>
            <Text style={styles.igText}>FOLLOW {INSTAGRAM_LINK.handle}</Text>
          </Pressable>
          <DvdVideoMark />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.sm,
  },
  logo: { alignItems: 'center', marginVertical: space.sm },
  grid: { flex: 1, width: '100%', gap: space.sm },
  footer: { alignItems: 'center', gap: space.sm, marginTop: space.sm },
  ig: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: rgba(colors.orange, 0.7),
    backgroundColor: rgba(colors.orange, 0.12),
    ...glow(colors.orange, 10, 0.4),
  },
  igGlyph: { color: colors.orange, fontSize: 18 },
  igText: { fontFamily: fonts.heading, color: colors.orange, letterSpacing: 2.5, fontSize: 17 },
});
