import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';

import JerkVestLogo from '@/components/JerkVestLogo';
import MenuTile from '@/components/MenuTile';
import { SpecialFeaturesBar, DvdVideoMark } from '@/components/Chrome';
import { MENU } from '@/lib/content';
import { space } from '@/lib/theme';

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <SpecialFeaturesBar />
        </View>

        <View style={styles.logo}>
          <JerkVestLogo size={0.8} />
        </View>

        <View style={styles.grid}>
          {MENU.map((item, i) => (
            <MenuTile key={item.key} item={item} index={i} active={i === active} />
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
  content: { paddingHorizontal: space.lg, paddingTop: space.lg, alignItems: 'center' },
  top: { width: '100%', alignItems: 'center', marginTop: space.sm, marginBottom: space.lg },
  logo: { marginBottom: space.xl, marginTop: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  bottom: { marginTop: space.lg, marginBottom: space.xl, alignItems: 'center' },
});
