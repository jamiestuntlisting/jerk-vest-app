/**
 * The thin framing border + corner crosshairs that wrap the whole menu,
 * like the registration marks around a DVD menu / film scan. Purely
 * decorative, so it never intercepts touches.
 */
import { StyleSheet, View } from 'react-native';
import { colors, rgba } from '@/lib/theme';

function CornerPlus({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const pos: Record<string, object> = {
    tl: { top: 18, left: 18 },
    tr: { top: 18, right: 18 },
    bl: { bottom: 18, left: 18 },
    br: { bottom: 18, right: 18 },
  };
  return (
    <View style={[styles.plusWrap, pos[corner]]} pointerEvents="none">
      <View style={styles.plusH} />
      <View style={styles.plusV} />
    </View>
  );
}

export default function DvdFrame() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.border} />
      <View style={styles.borderInner} />
      <CornerPlus corner="tl" />
      <CornerPlus corner="tr" />
      <CornerPlus corner="bl" />
      <CornerPlus corner="br" />
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.5),
    borderRadius: 20,
  },
  borderInner: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.16),
    borderRadius: 16,
  },
  plusWrap: { position: 'absolute', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  plusH: { position: 'absolute', width: 16, height: 1.5, backgroundColor: rgba(colors.purpleGlow, 0.8) },
  plusV: { position: 'absolute', width: 1.5, height: 16, backgroundColor: rgba(colors.purpleGlow, 0.8) },
});
