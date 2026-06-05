/**
 * Film overlay. By the time this mounts, the tape has already pushed into the
 * VCR on the home screen — so this just fades in over it, shows a beat of VHS
 * static, then plays the film (inline YouTube on web; external on native).
 */
import { createElement, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import VhsStatic from '@/components/VhsStatic';
import { openExternal } from '@/lib/links';
import { colors, fonts, fill, glow, rgba } from '@/lib/theme';

function YouTube({ id }: { id: string }) {
  return createElement('iframe', {
    src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
    style: { width: '100%', height: '100%', border: 0 },
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen: true,
  });
}

export default function VhsPlayer({ youtubeId, onClose }: { youtubeId: string; onClose: () => void }) {
  const [phase, setPhase] = useState<'static' | 'play'>('static');
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) });
    const t = setTimeout(() => {
      if (Platform.OS === 'web') {
        setPhase('play');
      } else {
        void openExternal(`https://www.youtube.com/watch?v=${youtubeId}`, youtubeId);
        onClose();
      }
    }, 750);
    return () => clearTimeout(t);
  }, [fade, youtubeId, onClose]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <Animated.View style={[styles.overlay, fadeStyle]}>
      {phase === 'static' ? (
        <View style={fill}>
          <VhsStatic />
          <View style={styles.osd}>
            <Text style={styles.osdPlay}>▶ PLAY</Text>
            <Text style={styles.osdSp}>SP  0:00:00</Text>
          </View>
        </View>
      ) : (
        <View style={styles.film}>{youtubeId ? <YouTube id={youtubeId} /> : null}</View>
      )}

      <Pressable onPress={onClose} hitSlop={12} style={styles.close} accessibilityLabel="Close">
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...fill, backgroundColor: '#000', zIndex: 200, alignItems: 'center', justifyContent: 'center' },
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
