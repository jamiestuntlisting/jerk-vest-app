import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

import JerkVestLogo from '@/components/JerkVestLogo';
import FeaturedHero from '@/components/FeaturedHero';
import TapeStack from '@/components/TapeStack';
import SwapLayer, { type Flight } from '@/components/SwapLayer';
import VhsPlayer from '@/components/VhsPlayer';
import { TAPES, FOOTER_LINKS } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { APP_MAX_WIDTH, colors, fonts, space } from '@/lib/theme';

type Rect = { x: number; y: number; width: number; height: number };
const center = (r: Rect) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });

export default function MenuScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [featuredKey, setFeaturedKey] = useState<string | null>(TAPES[0].key);
  const [phase, setPhase] = useState<'idle' | 'inserting' | 'watching'>('idle');
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [hideShelfKey, setHideShelfKey] = useState<string | null>(null);
  const [hideVcrTape, setHideVcrTape] = useState(false);

  const progress = useSharedValue(0);
  const swapProgress = useSharedValue(0);
  const slotNode = useRef<View | null>(null);
  const rootNode = useRef<View | null>(null);
  const shelfNodes = useRef<Record<string, View | null>>({});
  const pendingCommit = useRef<(() => void) | null>(null);

  const byKey = (k: string) => TAPES.find((t) => t.key === k)!;
  const featured = featuredKey ? byKey(featuredKey) : null;

  const cap = Math.min(width, APP_MAX_WIDTH);
  const vcrTapeW = cap * 0.62;
  const tapeH = vcrTapeW * 0.34;
  const shelfLen = cap * 0.46;
  const s = shelfLen / vcrTapeW; // upright scale

  const animating = flights !== null;
  const busy = phase !== 'idle' || animating;

  /** Measure a node's rect in coordinates local to the home root. */
  const measureRel = (node: View) =>
    new Promise<Rect>((resolve) => {
      const root = rootNode.current;
      if (!root) return;
      root.measureInWindow((rx, ry) => {
        node.measureInWindow((x, y, w, h) => resolve({ x: x - rx, y: y - ry, width: w, height: h }));
      });
    });

  const finishFlights = () => {
    pendingCommit.current?.();
    pendingCommit.current = null;
    setFlights(null);
    setHideShelfKey(null);
    setHideVcrTape(false);
    swapProgress.value = 0;
  };

  const runFlights = (fl: Flight[], hideShelf: string | null, hideVcr: boolean, commit: () => void) => {
    pendingCommit.current = commit;
    setHideShelfKey(hideShelf);
    setHideVcrTape(hideVcr);
    setFlights(fl);
    swapProgress.value = 0;
    swapProgress.value = withTiming(1, { duration: 950, easing: Easing.inOut(Easing.cubic) }, (finished) => {
      'worklet';
      if (finished) runOnJS(finishFlights)();
    });
  };

  const startPlay = () => {
    if (busy || !featured) return;
    track('video_play', { label: featured.youtubeId, meta: { title: featured.title } });
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

  const onPressTape = async (key: string) => {
    if (busy) return;
    const slot = slotNode.current;
    const keyNode = shelfNodes.current[key];
    if (!rootNode.current || !slot || !keyNode) return;
    const vc = center(await measureRel(slot));
    const kc = center(await measureRel(keyNode));
    track('menu_click', { label: key, meta: { area: 'shelf' } });

    if (featured && featuredKey) {
      const featNode = shelfNodes.current[featuredKey];
      if (!featNode) return;
      const fc = center(await measureRel(featNode));
      const out = featured;
      runFlights(
        [
          { key: 'in', tape: byKey(key), from: kc, to: vc, fromRot: 90, toRot: 0, fromScale: s, toScale: 1 },
          { key: 'out', tape: out, from: vc, to: fc, fromRot: 0, toRot: 90, fromScale: 1, toScale: s },
        ],
        key,
        true,
        () => setFeaturedKey(key),
      );
    } else {
      runFlights(
        [{ key: 'in', tape: byKey(key), from: kc, to: vc, fromRot: 90, toRot: 0, fromScale: s, toScale: 1 }],
        key,
        false,
        () => setFeaturedKey(key),
      );
    }
  };

  const onEject = async () => {
    if (busy || !featured || !featuredKey) return;
    const slot = slotNode.current;
    const featNode = shelfNodes.current[featuredKey];
    if (!rootNode.current || !slot || !featNode) return;
    const vc = center(await measureRel(slot));
    const fc = center(await measureRel(featNode));
    track('menu_click', { label: featuredKey, meta: { area: 'eject' } });
    const out = featured;
    runFlights(
      [{ key: 'out', tape: out, from: vc, to: fc, fromRot: 0, toRot: 90, fromScale: 1, toScale: s }],
      null,
      true,
      () => setFeaturedKey(null),
    );
  };

  const emptyKeys = [featuredKey, hideShelfKey].filter(Boolean) as string[];

  return (
    <View ref={rootNode} style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.logo}>
            <JerkVestLogo size={0.46} showProductions={false} />
          </View>

          <FeaturedHero
            featured={featured}
            progress={progress}
            idle={phase === 'idle' && !animating}
            onPlay={startPlay}
            onEject={onEject}
            slotRef={(n) => {
              slotNode.current = n;
            }}
            hideTape={hideVcrTape}
          />

          <TapeStack
            tapes={TAPES}
            emptyKeys={emptyKeys}
            onPressTape={onPressTape}
            onSlotRef={(k, n) => {
              shelfNodes.current[k] = n;
            }}
          />

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

      {flights ? <SwapLayer flights={flights} w={vcrTapeW} h={tapeH} progress={swapProgress} /> : null}

      {phase === 'watching' && featured ? <VhsPlayer youtubeId={featured.youtubeId} onClose={closePlay} /> : null}
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
