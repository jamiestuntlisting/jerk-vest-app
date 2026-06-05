/**
 * The play ritual. Tapping the featured tape opens this full-screen overlay:
 *   1. insert — the VHS slides down into the VCR, then a plastic door swings
 *               shut over the slot to block it (~1s)
 *   2. static — VHS tracking static + "PLAY" OSD (~1s)
 *   3. play   — the film (inline YouTube on web; opens externally on native)
 */
import { createElement, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import VhsTape from '@/components/VhsTape';
import VhsStatic from '@/components/VhsStatic';
import { openExternal } from '@/lib/links';
import { colors, fonts, fill, glow, rgba } from '@/lib/theme';

type Phase = 'insert' | 'static' | 'play';

function YouTube({ id }: { id: string }) {
  return createElement('iframe', {
    src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
    style: { width: '100%', height: '100%', border: 0 },
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen: true,
  });
}

export default function VhsPlayer({
  youtubeId,
  title,
  onClose,
}: {
  youtubeId: string;
  title: string;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('insert');
  const { width } = useWindowDimensions();
  const ins = useSharedValue(0);

  const stageW = Math.min(width - 32, 320);
  const tapeW = stageW - 20;

  useEffect(() => {
    ins.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.cubic) });
    const t1 = setTimeout(() => setPhase('static'), 1050);
    const t2 = setTimeout(() => {
      if (Platform.OS === 'web') {
        setPhase('play');
      } else {
        void openExternal(`https://www.youtube.com/watch?v=${youtubeId}`, youtubeId);
        onClose();
      }
    }, 1950);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ins, youtubeId, onClose]);

  // VHS lowers into the slot, then fades behind the unit.
  const tapeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(ins.value, [0, 0.6], [0, 150], Extrapolation.CLAMP) }],
    opacity: interpolate(ins.value, [0.5, 0.66], [1, 0], Extrapolation.CLAMP),
  }));
  // Plastic door swings down (rotateX 92°→0°) to block the slot once the tape is in.
  const doorStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateX: `${interpolate(ins.value, [0.6, 1], [92, 0], Extrapolation.CLAMP)}deg` },
    ],
  }));

  return (
    <View style={styles.overlay}>
      {phase === 'insert' ? (
        <View style={[styles.stage, { width: stageW }]}>
          <Animated.View style={[styles.tapeFloat, tapeStyle]}>
            <VhsTape title={title} width={tapeW} />
          </Animated.View>

          <View style={[styles.vcr, { width: stageW }]}>
            <View style={styles.vcrFace}>
              <View style={styles.slotMouth} />
              <Animated.View style={[styles.vcrDoor, doorStyle]} />
            </View>
            <View style={styles.vcrRow}>
              <View style={styles.led} />
              <Text style={styles.vcrText}>JERK VEST  HiFi  STEREO</Text>
            </View>
          </View>
        </View>
      ) : null}

      {phase === 'static' ? (
        <View style={fill}>
          <VhsStatic />
          <View style={styles.osd}>
            <Text style={styles.osdPlay}>▶ PLAY</Text>
            <Text style={styles.osdSp}>SP  0:00:00</Text>
          </View>
        </View>
      ) : null}

      {phase === 'play' ? <View style={styles.film}>{youtubeId ? <YouTube id={youtubeId} /> : null}</View> : null}

      <Pressable onPress={onClose} hitSlop={12} style={styles.close} accessibilityLabel="Close">
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...fill, backgroundColor: '#000', zIndex: 200, alignItems: 'center', justifyContent: 'center' },
  stage: { height: 300, justifyContent: 'flex-end' },
  tapeFloat: { position: 'absolute', top: 10, left: 10, right: 10, alignItems: 'center' },
  vcr: { position: 'absolute', bottom: 0, alignItems: 'center' },
  vcrFace: {
    width: '100%',
    height: 74,
    backgroundColor: '#15131a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.3),
    overflow: 'hidden',
    ...glow(colors.purpleDark, 18, 0.5),
  },
  slotMouth: { position: 'absolute', top: 16, left: 22, right: 22, height: 15, backgroundColor: '#000', borderRadius: 3, borderWidth: 1, borderColor: '#2a2533' },
  vcrDoor: {
    position: 'absolute',
    top: 16,
    left: 22,
    right: 22,
    height: 15,
    backgroundColor: '#26222e',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: rgba(colors.white, 0.12),
    transformOrigin: '50% 0%',
  },
  vcrRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  led: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.orange, ...glow(colors.orange, 6, 0.9) },
  vcrText: { fontFamily: fonts.heading, color: rgba(colors.textBright, 0.6), letterSpacing: 2, fontSize: 11 },
  osd: { position: 'absolute', top: '12%', left: '8%' },
  osdPlay: { fontFamily: fonts.heading, color: colors.white, fontSize: 30, letterSpacing: 3, ...glow(colors.white, 8, 0.5) },
  osdSp: { fontFamily: fonts.heading, color: rgba(colors.white, 0.85), fontSize: 16, letterSpacing: 2, marginTop: 4 },
  film: { width: '100%', aspectRatio: 16 / 9, maxHeight: '100%', backgroundColor: '#000' },
  close: {
    position: 'absolute',
    top: Platform.select({ web: 16, default: 50 }),
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.black, 0.6),
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.4),
  },
  closeText: { color: colors.white, fontSize: 20, fontFamily: fonts.bodyBold },
});
