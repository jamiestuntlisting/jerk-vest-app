/**
 * A front-on VCR with the featured VHS seated in its open slot, fully visible.
 * Full-bleed width; the tape is half the width and the deck is wide-and-short
 * like a real VCR, with the controls in the margins either side of the slot.
 *
 * Drives the insert: pass a `progress` shared value (0→1) and the tape pushes
 * straight down into the slot, then the plastic door swings shut over it. With
 * no `progress` (the home), the tape just sits there, fully visible.
 */
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import VhsTape from '@/components/VhsTape';
import { colors, fonts, fill, glow, rgba } from '@/lib/theme';

export default function VcrScene({
  width,
  title,
  accent = colors.orange,
  ribbon,
  progress,
}: {
  width: number;
  title: string;
  accent?: string;
  ribbon?: string;
  progress?: SharedValue<number>;
}) {
  const W = width;
  const tapeW = W * 0.5; // tape is half the screen width
  const tapeH = tapeW * 0.34;
  const pad = 8;
  const bezelH = tapeH * 0.55; // top brand strip
  const bottomH = tapeH * 0.8; // controls / label strip
  const tapeTop = bezelH + pad;
  const mouthY = tapeTop + tapeH;
  const Hv = mouthY + pad + bottomH;
  const clipTop = tapeTop - pad;
  const clipH = mouthY - clipTop;
  const slotLeft = (W - tapeW) / 2;
  const side = slotLeft; // margin either side of the slot
  const slideDist = tapeH + 16;

  const tapeStyle = useAnimatedStyle(() => {
    const p = progress ? progress.value : 0;
    return { transform: [{ translateY: interpolate(p, [0, 0.6], [0, slideDist], Extrapolation.CLAMP) }] };
  });
  const flapStyle = useAnimatedStyle(() => {
    const p = progress ? progress.value : 0;
    return {
      opacity: interpolate(p, [0.48, 0.6], [0, 1], Extrapolation.CLAMP),
      transform: [
        { perspective: 600 },
        { rotateX: `${interpolate(p, [0.58, 1], [-105, 0], Extrapolation.CLAMP)}deg` },
      ],
    };
  });

  return (
    <View style={{ width: W, height: Hv }}>
      {/* body */}
      <LinearGradient colors={['#2a2433', '#0b0910']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[fill, styles.body, { borderRadius: tapeH * 0.16 }]} />
      <View style={[styles.sheen, { borderTopLeftRadius: tapeH * 0.16, borderTopRightRadius: tapeH * 0.16, height: bezelH }]} />

      {/* top bezel: brand + vents */}
      <View style={[styles.bezel, { top: bezelH * 0.24, height: bezelH * 0.6, left: W * 0.05, right: W * 0.05 }]}>
        <Text style={[styles.brand, { fontSize: bezelH * 0.46 }]} numberOfLines={1}>
          JERK VEST
        </Text>
        <View style={styles.vents}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.vent, { width: side * 0.35 }]} />
          ))}
        </View>
      </View>

      {/* dark slot compartment (behind the tape) */}
      <View style={[styles.recess, { left: slotLeft - 6, width: tapeW + 12, top: clipTop - 4, height: clipH + 8 }]} />

      {/* left controls */}
      <View style={[styles.leftCol, { left: W * 0.05, top: tapeTop + tapeH * 0.08, gap: tapeH * 0.16 }]}>
        <View style={[styles.btn, { width: side * 0.62, height: tapeH * 0.26 }]}>
          <Text style={styles.btnLabel}>PWR</Text>
        </View>
        <View style={[styles.btn, { width: side * 0.62, height: tapeH * 0.26 }]}>
          <Text style={styles.btnLabel}>EJECT</Text>
        </View>
      </View>

      {/* right controls: jog dial + transport */}
      <View style={[styles.rightCol, { right: W * 0.05, top: tapeTop, gap: tapeH * 0.14 }]}>
        <View style={[styles.jog, { width: side * 0.6, height: side * 0.6, borderRadius: side * 0.3 }]}>
          <View style={[styles.jogHub, { width: side * 0.22, height: side * 0.22, borderRadius: side * 0.11 }]} />
        </View>
        <View style={styles.playRow}>
          <View style={styles.playTri} />
          <View style={styles.stopSq} />
        </View>
      </View>

      {/* bottom: display + label */}
      <View style={[styles.bottom, { left: W * 0.05, right: W * 0.05, top: mouthY + pad, height: bottomH - pad }]}>
        <View style={styles.display}>
          <Text style={[styles.displayText, { fontSize: bottomH * 0.32 }]}>SP  0:00</Text>
        </View>
        <Text style={[styles.vcrLabel, { fontSize: bottomH * 0.28 }]} numberOfLines={1}>
          VIDEO CASSETTE RECORDER
        </Text>
      </View>

      {/* featured tape, clipped into the slot */}
      <View style={{ position: 'absolute', left: slotLeft, top: clipTop, width: tapeW, height: clipH, overflow: 'hidden', justifyContent: 'flex-end' }}>
        <Animated.View style={tapeStyle}>
          <VhsTape title={title} width={tapeW} accent={accent} />
        </Animated.View>
      </View>

      {/* ribbon on the tape (home only) */}
      {ribbon ? (
        <View style={[styles.ribbon, { left: slotLeft - 7, top: tapeTop - 1 }]}>
          <Text style={styles.ribbonText}>{ribbon}</Text>
        </View>
      ) : null}

      {/* plastic door — swings shut over the slot on insert */}
      <Animated.View style={[styles.flap, { left: slotLeft - 4, width: tapeW + 8, top: clipTop - 2, height: clipH + 6 }, flapStyle]}>
        <View style={styles.flapSeam} />
        <View style={[styles.flapNotch, { width: tapeW * 0.18 }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { borderWidth: 1, borderColor: rgba(colors.purpleLight, 0.25) },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: rgba(colors.white, 0.04) },
  bezel: { position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontFamily: fonts.heading, color: rgba(colors.textBright, 0.55), letterSpacing: 2 },
  vents: { flexDirection: 'row', gap: 4 },
  vent: { height: 2, borderRadius: 2, backgroundColor: rgba(colors.white, 0.1) },
  recess: { position: 'absolute', backgroundColor: '#05040a', borderRadius: 6, borderWidth: 1, borderColor: '#000' },
  leftCol: { position: 'absolute' },
  btn: { borderRadius: 3, backgroundColor: '#1a1622', borderWidth: 1, borderColor: rgba(colors.white, 0.08), alignItems: 'center', justifyContent: 'center' },
  btnLabel: { fontFamily: fonts.heading, color: rgba(colors.textBright, 0.5), fontSize: 8, letterSpacing: 1 },
  rightCol: { position: 'absolute', alignItems: 'center' },
  jog: { backgroundColor: '#15121c', borderWidth: 1, borderColor: rgba(colors.white, 0.1), alignItems: 'center', justifyContent: 'center' },
  jogHub: { backgroundColor: '#2a2435', borderWidth: 1, borderColor: rgba(colors.white, 0.08) },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  playTri: { width: 0, height: 0, borderTopWidth: 4, borderBottomWidth: 4, borderLeftWidth: 7, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: rgba(colors.textBright, 0.6) },
  stopSq: { width: 7, height: 7, borderRadius: 1, backgroundColor: rgba(colors.textBright, 0.45) },
  bottom: { position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  display: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, backgroundColor: '#04130b', borderWidth: 1, borderColor: rgba('#39FF8B', 0.25) },
  displayText: { fontFamily: fonts.heading, color: '#39FF8B', letterSpacing: 2, ...glow('#39FF8B', 5, 0.5) },
  vcrLabel: { fontFamily: fonts.heading, color: rgba(colors.textBright, 0.35), letterSpacing: 1.5 },
  ribbon: { position: 'absolute', backgroundColor: colors.orange, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 3, transform: [{ rotate: '-7deg' }], ...glow(colors.orange, 10, 0.7), zIndex: 5 },
  ribbonText: { fontFamily: fonts.heading, color: colors.white, letterSpacing: 1.5, fontSize: 11 },
  flap: {
    position: 'absolute',
    backgroundColor: '#211c2b',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: rgba(colors.white, 0.12),
    transformOrigin: '50% 0%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  flapSeam: { position: 'absolute', top: 4, left: '8%', right: '8%', height: 1, backgroundColor: rgba(colors.white, 0.1) },
  flapNotch: { height: 5, borderRadius: 2, backgroundColor: rgba(colors.black, 0.5) },
});
