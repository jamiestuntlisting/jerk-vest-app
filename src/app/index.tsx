import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.header}>
          <SpecialFeaturesBar />
          <View style={styles.logo}>
            <JerkVestLogo size={0.82} />
          </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.sm,
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center' },
  logo: { alignItems: 'center', marginTop: space.md },
  grid: { width: '100%', gap: space.md, marginVertical: space.lg },
  footer: { alignItems: 'center', gap: space.lg },
  ig: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: rgba(colors.orange, 0.7),
    backgroundColor: rgba(colors.orange, 0.12),
    ...glow(colors.orange, 12, 0.4),
  },
  igGlyph: { color: colors.orange, fontSize: 20 },
  igText: { fontFamily: fonts.heading, color: colors.orange, letterSpacing: 2.5, fontSize: 19 },
});
