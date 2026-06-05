/**
 * A VHS cassette drawn with views, shown along its spine: a chunky horizontal
 * slab whose big top label is simply the movie title (hand-scrawled), with a
 * slim plastic front edge. No reels — that's what separates a VHS from an audio
 * cassette. Scales by `width`.
 */
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fill, rgba } from '@/lib/theme';

export default function VhsTape({
  title,
  width,
  accent = colors.orange,
  compact = false,
}: {
  title: string;
  width: number;
  accent?: string;
  compact?: boolean;
}) {
  const H = width * 0.34;
  const r = H * 0.14;

  return (
    <View style={{ width, height: H }}>
      {/* shell */}
      <LinearGradient colors={['#2b2438', '#0c0a12']} start={{ x: 0.2, y: 0 }} end={{ x: 0.85, y: 1 }} style={[fill, styles.shell, { borderRadius: r }]} />
      <View style={[styles.sheen, { borderTopLeftRadius: r, borderTopRightRadius: r }]} />

      {/* spine label — the movie title */}
      <View
        style={[
          styles.label,
          { top: H * 0.12, left: width * 0.05, right: width * 0.05, bottom: H * 0.32, paddingHorizontal: width * 0.05, paddingTop: H * 0.05 },
        ]}>
        <View style={[styles.stripe, { backgroundColor: accent }]} />
        <Text
          style={[styles.title, { fontSize: H * (compact ? 0.5 : 0.42) }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.4}>
          {title}
        </Text>
      </View>

      {/* slim plastic front edge (the flap) */}
      <View style={[styles.lip, { height: H * 0.24, borderBottomLeftRadius: r, borderBottomRightRadius: r }]}>
        <View style={styles.lipSeam} />
        <View style={[styles.lipNotch, { height: H * 0.08 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { borderWidth: 1.2, borderColor: rgba(colors.purpleLight, 0.35) },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '34%', backgroundColor: rgba(colors.white, 0.05) },
  label: {
    position: 'absolute',
    backgroundColor: '#efe7d6',
    borderRadius: 3,
    transform: [{ rotate: '-1deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stripe: { position: 'absolute', top: 0, left: 0, right: 0, height: '20%' },
  title: { fontFamily: fonts.marker, color: '#171318', textAlign: 'center', transform: [{ rotate: '-1deg' }] },
  lip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#100d16',
    borderTopWidth: 1,
    borderTopColor: rgba(colors.white, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lipSeam: { position: 'absolute', top: 3, left: '8%', right: '8%', height: 1, backgroundColor: rgba(colors.white, 0.08) },
  lipNotch: { width: '16%', borderRadius: 2, backgroundColor: rgba(colors.black, 0.55), borderWidth: 1, borderColor: rgba(colors.white, 0.06) },
});
