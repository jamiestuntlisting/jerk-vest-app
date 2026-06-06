/**
 * The tape-swap animation. When a shelf tape is tapped, two tapes fly at once:
 * the current VCR tape arcs out to the shelf (landscape → upright) while the
 * tapped tape arcs into the VCR (upright → landscape). Driven by one progress.
 */
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import VhsTape from '@/components/VhsTape';
import { fill } from '@/lib/theme';

type Rect = { x: number; y: number; width: number; height: number };
type Tape = { title: string; accent: string };
type Pt = { x: number; y: number };

const center = (r: Rect): Pt => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });

function Flyer({
  tape,
  from,
  to,
  fromRot,
  toRot,
  fromScale,
  toScale,
  w,
  h,
  progress,
}: {
  tape: Tape;
  from: Pt;
  to: Pt;
  fromRot: number;
  toRot: number;
  fromScale: number;
  toScale: number;
  w: number;
  h: number;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const cx = interpolate(p, [0, 1], [from.x, to.x]);
    const cy = interpolate(p, [0, 1], [from.y, to.y]) - 44 * Math.sin(p * Math.PI); // gentle arc
    return {
      transform: [
        { translateX: cx - w / 2 },
        { translateY: cy - h / 2 },
        { rotate: `${interpolate(p, [0, 1], [fromRot, toRot])}deg` },
        { scale: interpolate(p, [0, 1], [fromScale, toScale]) },
      ],
    };
  });

  return (
    <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: w, height: h }, style]}>
      <VhsTape title={tape.title} width={w} accent={tape.accent} />
    </Animated.View>
  );
}

export default function SwapLayer({
  into,
  out,
  vcrRect,
  shelfRect,
  vcrTapeW,
  shelfLen,
  progress,
}: {
  into: Tape;
  out: Tape;
  vcrRect: Rect;
  shelfRect: Rect;
  vcrTapeW: number;
  shelfLen: number;
  progress: SharedValue<number>;
}) {
  const w = vcrTapeW;
  const h = vcrTapeW * 0.34;
  const s = shelfLen / vcrTapeW; // upright tapes are scaled down from the deck size
  const vc = center(vcrRect);
  const sc = center(shelfRect);

  return (
    <View style={[fill, { zIndex: 150 }]} pointerEvents="none">
      {/* current featured: VCR (flat) → shelf (upright) */}
      <Flyer tape={out} from={vc} to={sc} fromRot={0} toRot={90} fromScale={1} toScale={s} w={w} h={h} progress={progress} />
      {/* tapped tape: shelf (upright) → VCR (flat) */}
      <Flyer tape={into} from={sc} to={vc} fromRot={90} toRot={0} fromScale={s} toScale={1} w={w} h={h} progress={progress} />
    </View>
  );
}
