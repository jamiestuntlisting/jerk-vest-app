import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';

import JerkVestLogo from '@/components/JerkVestLogo';
import MenuTile from '@/components/MenuTile';
import { SpecialFeaturesBar, DvdVideoMark } from '@/components/Chrome';
import { MENU } from '@/lib/content';
import { space } from '@/lib/theme';

// Lay the six tiles out as three rows of two so they can stretch to fill.
const ROWS = [MENU.slice(0, 2), MENU.slice(2, 4), MENU.slice(4, 6)];

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.top}>
          <SpecialFeaturesBar />
        </View>

        <View style={styles.logo}>
          <JerkVestLogo size={0.8} />
        </View>

        <View style={styles.grid}>
          {ROWS.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((item, c) => (
                <MenuTile key={item.key} item={item} index={r * 2 + c} active={active === r * 2 + c} />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.bottom}>
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
  },
  top: { width: '100%', alignItems: 'center', marginTop: space.xs },
  logo: { alignItems: 'center', marginVertical: space.md },
  grid: { flex: 1, width: '100%', gap: space.md, justifyContent: 'center', minHeight: 360 },
  row: { flex: 1, flexDirection: 'row', gap: space.md },
  bottom: { marginTop: space.md, alignItems: 'center' },
});
