import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

import JerkVestLogo from '@/components/JerkVestLogo';
import FeaturedHero from '@/components/FeaturedHero';
import TapeStack, { type Rect } from '@/components/TapeStack';
import SwapLayer from '@/components/SwapLayer';
import VhsPlayer from '@/components/VhsPlayer';
import { TAPES, FOOTER_LINKS } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { APP_MAX_WIDTH, colors, fonts, space } from '@/lib/theme';

type Phase = 'idle' | 'inserting' | 'watching';
type Swap = { into: string; out: string; vcrRect: Rect; shelfRect: Rect };

export default function MenuScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [featuredKey, setFeaturedKey] = useState(TAPES[0].key);
  const [shelfOrder, setShelfOrder] = useState<string[]>(() => TAPES.slice(1).map((t) => t.key));
  const [phase, setPhase] = useState<Phase>('idle');
  const [swap, setSwap] = useState<Swap | null>(null);

  const progress = useSharedValue(0);
  const swapProgress = useSharedValue(0);
  const slotNode = useRef<View | null>(null);

  const byKey = (k: string) => TAPES.find((t) => t.key === k)!;
  const featured = byKey(featuredKey);
  const shelfTapes = shelfOrder.map(byKey);

  const cap = Math.min(width, APP_MAX_WIDTH);
  const vcrTapeW = cap * 0.62;
  const shelfLen = cap * 0.46;

  const busy = phase !== 'idle' || swap !== null;

  const startPlay = () => {
    if (busy) return;
    track('video_play', { label: featured.youtubeId, meta: { title: featured.title, area: 'hero' } });
    setPhase('inserting');
    progress.value = withTiming(1, { duration: 950, easing: Easing.inOut(Easing.cubic) }, (finished) => {
      'worklet';
      if (finished) runOnJS(setPhase)('watching');
    });
  };

  const closePlay = () => {
    setPhase('idle');
    progress.value = 0;
  };

  const finishSwap = (intoKey: string, outKey: string) => {
    setShelfOrder((order) => order.map((k) => (k === intoKey ? outKey : k)));
    setFeaturedKey(intoKey);
    setSwap(null);
    swapProgress.value = 0;
  };

  const onPressTape = (key: string, shelfRect: Rect) => {
    if (busy) return;
    const node = slotNode.current;
    if (!node) return;
    node.measureInWindow((x, y, w, h) => {
      track('menu_click', { label: key, meta: { area: 'shelf-swap' } });
      setSwap({ into: key, out: featuredKey, vcrRect: { x, y, width: w, height: h }, shelfRect });
      swapProgress.value = 0;
      swapProgress.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.cubic) }, (finished) => {
        'worklet';
        if (finished) runOnJS(finishSwap)(key, featuredKey);
      });
    });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.logo}>
            <JerkVestLogo size={0.46} showProductions={false} />
          </View>

          <FeaturedHero
            featured={featured}
            progress={progress}
            idle={phase === 'idle' && !swap}
            onPlay={startPlay}
            slotRef={(n) => {
              slotNode.current = n;
            }}
            hideTape={!!swap}
          />

          <TapeStack tapes={shelfTapes} hiddenKey={swap?.into ?? null} onPressTape={onPressTape} />

          <View style={styles.footer}>
            {FOOTER_LINKS.map((l) => (
              <Pressable
                key={l.key}
                hitSlop={6}
                onPress={() => {
                  track('menu_click', { label: l.key, meta: { area: 'footer' } });
                  if (l.kind === 'external') void openExternal(l.target, l.key);
                  else router.push(l.target as never);
                }}>
                <Text style={styles.footerLink}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {swap ? (
        <SwapLayer
          into={byKey(swap.into)}
          out={byKey(swap.out)}
          vcrRect={swap.vcrRect}
          shelfRect={swap.shelfRect}
          vcrTapeW={vcrTapeW}
          shelfLen={shelfLen}
          progress={swapProgress}
        />
      ) : null}

      {phase === 'watching' ? <VhsPlayer youtubeId={featured.youtubeId} onClose={closePlay} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: space.lg, gap: space.lg },
  logo: { alignItems: 'center' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: space.lg, rowGap: space.xs, paddingHorizontal: space.lg },
  footerLink: { fontFamily: fonts.heading, color: colors.orangeLight, letterSpacing: 2, fontSize: 13 },
});
