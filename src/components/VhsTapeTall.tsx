/**
 * An upright VHS tape — standing on a shelf, spine out — for the catalog row.
 * Portrait body with the title running vertically up the spine, hand-scrawled.
 */
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fill, rgba } from '@/lib/theme';

export default function VhsTapeTall({
  title,
  width,
  accent = colors.purpleLight,
}: {
  title: string;
  width: number;
  accent?: string;
}) {
  const w = width;
  const h = w * 1.6;
  const r = w * 0.07;
  const labelInnerH = h * 0.62;
  const titleSize = Math.min(w * 0.4, labelInnerH / (Math.max(title.length, 1) * 0.62));

  return (
    <View style={{ width: w, height: h }}>
      {/* shell */}
      <LinearGradient colors={['#2b2438', '#0c0a12']} start={{ x: 0, y: 0.2 }} end={{ x: 1, y: 0.8 }} style={[fill, styles.shell, { borderRadius: r }]} />
      <View style={[styles.sheen, { borderTopLeftRadius: r, borderTopRightRadius: r }]} />

      {/* spine label — vertical title */}
      <View style={[styles.label, { top: h * 0.1, bottom: h * 0.2, left: w * 0.14, right: w * 0.14, paddingVertical: h * 0.04 }]}>
        <View style={[styles.stripe, { backgroundColor: accent }]} />
        <Text style={[styles.title, { fontSize: titleSize, width: labelInnerH }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* plastic front edge at the foot */}
      <View style={[styles.foot, { height: h * 0.16, borderBottomLeftRadius: r, borderBottomRightRadius: r }]}>
        <View style={[styles.footNotch, { width: w * 0.34 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { borderWidth: 1.2, borderColor: rgba(colors.purpleLight, 0.35) },
  sheen: { position: 'absolute', top: 0, left: 0, width: '32%', bottom: 0, backgroundColor: rgba(colors.white, 0.05) },
  label: {
    position: 'absolute',
    backgroundColor: '#efe7d6',
    borderRadius: 3,
    transform: [{ rotate: '0.6deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  // accent stripe runs down the left edge of the spine label
  stripe: { position: 'absolute', top: 0, bottom: 0, left: 0, width: '18%' },
  title: { fontFamily: fonts.marker, color: '#171318', textAlign: 'center', transform: [{ rotate: '-90deg' }] },
  foot: {
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
  footNotch: { height: 4, borderRadius: 2, backgroundColor: rgba(colors.black, 0.55), borderWidth: 1, borderColor: rgba(colors.white, 0.06) },
});
