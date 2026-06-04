/**
 * A VHS cassette drawn entirely with views — the core visual of the home.
 * Landscape orientation, dark shell, a cream sticker with a hand-scrawled
 * (marker font) title, and two reels in a window. Scales by `width`.
 */
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fill, rgba } from '@/lib/theme';

function Reel({ size }: { size: number }) {
  return (
    <View style={[styles.reel, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.reelHub, { width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21 }]} />
    </View>
  );
}

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
  const H = width * 0.6;
  const reel = H * 0.26;

  return (
    <View style={{ width, height: H }}>
      {/* shell */}
      <LinearGradient colors={['#241f30', '#100d18']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={[fill, styles.shell, { borderRadius: width * 0.04 }]} />
      <View style={[styles.sheen, { borderTopLeftRadius: width * 0.04, borderTopRightRadius: width * 0.04 }]} />

      {/* label sticker */}
      <View
        style={[
          styles.label,
          {
            top: H * 0.1,
            left: W(width, 0.07),
            right: W(width, 0.07),
            height: H * 0.44,
            paddingHorizontal: W(width, 0.05),
          },
        ]}>
        {!compact ? (
          <View style={styles.labelTop}>
            <Text style={[styles.brand, { fontSize: H * 0.07 }]} numberOfLines={1}>
              JERK VEST
            </Text>
            <Text style={[styles.vhs, { fontSize: H * 0.07, color: accent }]}>VHS</Text>
          </View>
        ) : null}
        <Text style={[styles.title, { fontSize: H * (compact ? 0.2 : 0.21) }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {title}
        </Text>
        <View style={[styles.rule, { backgroundColor: rgba(accent, 0.8) }]} />
      </View>

      {/* window + reels */}
      <View style={[styles.window, { bottom: H * 0.07, left: W(width, 0.2), right: W(width, 0.2), height: H * 0.3 }]}>
        <Reel size={reel} />
        <View style={styles.tapeBand} />
        <Reel size={reel} />
      </View>

      {/* screws */}
      <View style={[styles.screw, { bottom: H * 0.05, left: W(width, 0.05), width: width * 0.014, height: width * 0.014, borderRadius: width * 0.007 }]} />
      <View style={[styles.screw, { bottom: H * 0.05, right: W(width, 0.05), width: width * 0.014, height: width * 0.014, borderRadius: width * 0.007 }]} />
    </View>
  );
}

/** width fraction helper */
function W(width: number, f: number) {
  return width * f;
}

const styles = StyleSheet.create({
  shell: { borderWidth: 1.2, borderColor: rgba(colors.purpleLight, 0.35) },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '32%', backgroundColor: rgba(colors.white, 0.05) },
  label: {
    position: 'absolute',
    backgroundColor: '#efe7d6',
    borderRadius: 3,
    transform: [{ rotate: '-1.2deg' }],
    justifyContent: 'center',
    overflow: 'hidden',
  },
  labelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontFamily: fonts.heading, color: '#6b2d8b', letterSpacing: 1 },
  vhs: { fontFamily: fonts.heading, letterSpacing: 1 },
  title: { fontFamily: fonts.marker, color: '#171318', transform: [{ rotate: '-1deg' }] },
  rule: { height: 2, borderRadius: 2, marginTop: 2 },
  window: {
    position: 'absolute',
    backgroundColor: '#050507',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
  },
  reel: { backgroundColor: '#211d2a', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#000' },
  reelHub: { backgroundColor: '#3a3550' },
  tapeBand: { flex: 1, height: '70%', marginHorizontal: 2, backgroundColor: '#1a1620', borderRadius: 1 },
  screw: { position: 'absolute', backgroundColor: rgba(colors.white, 0.18) },
});
