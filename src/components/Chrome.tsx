/** Small decorative DVD-menu chrome pieces shared across screens. */
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, glow, rgba } from '@/lib/theme';

/** The "──── SPECIAL FEATURES ────" header band at the top of the menu. */
export function SpecialFeaturesBar({ label = 'SPECIAL FEATURES' }: { label?: string }) {
  return (
    <View style={styles.sfRow}>
      <LinearGradient
        colors={['transparent', rgba(colors.purpleLight, 0.7)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.sfLine}
      />
      <Text style={styles.sfText}>{label}</Text>
      <LinearGradient
        colors={[rgba(colors.purpleLight, 0.7), 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.sfLine}
      />
    </View>
  );
}

/** The classic "DVD VIDEO™" mark for the bottom of the screen. */
export function DvdVideoMark() {
  return (
    <View style={styles.dvdWrap}>
      <View style={styles.dvdOval}>
        <Text style={styles.dvdText}>DVD</Text>
      </View>
      <Text style={styles.dvdVideo}>VIDEO™</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sfRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  sfLine: { height: 1, flex: 1, maxWidth: 70 },
  sfText: {
    fontFamily: fonts.heading,
    color: colors.purpleGlow,
    letterSpacing: 6,
    fontSize: 15,
    ...glow(colors.purpleGlow, 8, 0.5),
  },
  dvdWrap: { alignItems: 'center', opacity: 0.85 },
  dvdOval: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 16,
    backgroundColor: rgba(colors.purpleLight, 0.18),
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.55),
    transform: [{ skewX: '-12deg' }],
    ...glow(colors.purpleMain, 10, 0.4),
  },
  dvdText: {
    fontFamily: fonts.display,
    color: colors.purpleGlow,
    fontSize: 22,
    letterSpacing: 1,
    transform: [{ skewX: '6deg' }],
  },
  dvdVideo: { fontFamily: fonts.heading, color: rgba(colors.purpleGlow, 0.8), letterSpacing: 8, fontSize: 11, marginTop: 2 },
});
