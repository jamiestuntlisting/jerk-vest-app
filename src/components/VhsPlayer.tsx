/**
 * The play ritual. Tapping the featured tape opens this full-screen overlay:
 *   1. insert — the VHS pushes straight into the VCR slot, then the plastic
 *               door swings shut over it (~1.1s)
 *   2. static — VHS tracking static + "PLAY" OSD (~0.9s)
 *   3. play   — the film (inline YouTube on web; opens externally on native)
 */
import { createElement, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import VcrScene from '@/components/VcrScene';
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
  accent = colors.orange,
  onClose,
}: {
  youtubeId: string;
  title: string;
  accent?: string;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('insert');
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const vcrW = Math.min(width - 40, 360);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.cubic) });
    const t1 = setTimeout(() => setPhase('static'), 1200);
    const t2 = setTimeout(() => {
      if (Platform.OS === 'web') {
        setPhase('play');
      } else {
        void openExternal(`https://www.youtube.com/watch?v=${youtubeId}`, youtubeId);
        onClose();
      }
    }, 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [progress, youtubeId, onClose]);

  return (
    <View style={styles.overlay}>
      {phase === 'insert' ? (
        <View style={styles.stage}>
          <VcrScene width={vcrW} title={title} accent={accent} progress={progress} />
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
  stage: { alignItems: 'center', justifyContent: 'center' },
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
