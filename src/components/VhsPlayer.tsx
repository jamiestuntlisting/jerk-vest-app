/**
 * The play ritual. Tapping the featured tape opens this full-screen overlay:
 *   1. inserting — the tape slides down into a VCR slot (~1s)
 *   2. static    — VHS tracking static + "PLAY" OSD (~1s)
 *   3. playing   — the film (inline YouTube on web; opens externally on native)
 */
import { createElement, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import VhsTape from '@/components/VhsTape';
import VhsStatic from '@/components/VhsStatic';
import { openExternal } from '@/lib/links';
import { colors, fonts, fill, glow, rgba } from '@/lib/theme';

type Phase = 'inserting' | 'static' | 'playing';

function VcrSlot() {
  return (
    <View style={styles.vcr}>
      <View style={styles.vcrSlot} />
      <View style={styles.vcrRow}>
        <View style={styles.led} />
        <Text style={styles.vcrText}>JERK VEST  HiFi  STEREO</Text>
      </View>
    </View>
  );
}

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
  const [phase, setPhase] = useState<Phase>('inserting');
  const ins = useSharedValue(0);

  useEffect(() => {
    ins.value = withTiming(1, { duration: 900, easing: Easing.in(Easing.cubic) });
    const t1 = setTimeout(() => setPhase('static'), 950);
    const t2 = setTimeout(() => {
      if (Platform.OS === 'web') {
        setPhase('playing');
      } else {
        void openExternal(`https://www.youtube.com/watch?v=${youtubeId}`, youtubeId);
        onClose();
      }
    }, 1850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ins, youtubeId, onClose]);

  const tapeStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { translateY: interpolate(ins.value, [0, 1], [0, 150]) },
      { scale: interpolate(ins.value, [0, 1], [1, 0.62]) },
      { rotateX: `${interpolate(ins.value, [0, 1], [0, 72])}deg` },
    ],
    opacity: interpolate(ins.value, [0, 0.75, 1], [1, 1, 0]),
  }));

  return (
    <View style={styles.overlay}>
      {phase === 'inserting' ? (
        <View style={styles.insertStage}>
          <Animated.View style={tapeStyle}>
            <VhsTape title={title} width={210} />
          </Animated.View>
          <View style={styles.slotWrap}>
            <VcrSlot />
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

      {phase === 'playing' ? <View style={styles.film}>{youtubeId ? <YouTube id={youtubeId} /> : null}</View> : null}

      <Pressable onPress={onClose} hitSlop={12} style={styles.close} accessibilityLabel="Close">
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...fill, backgroundColor: '#000', zIndex: 200, alignItems: 'center', justifyContent: 'center' },
  insertStage: { ...fill, alignItems: 'center', justifyContent: 'center', gap: 8 },
  slotWrap: { position: 'absolute', bottom: '30%', width: '100%', alignItems: 'center' },
  vcr: {
    width: 260,
    backgroundColor: '#15131a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.3),
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...glow(colors.purpleDark, 16, 0.5),
  },
  vcrSlot: { height: 12, borderRadius: 3, backgroundColor: '#000', borderWidth: 1, borderColor: '#2a2533' },
  vcrRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
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
