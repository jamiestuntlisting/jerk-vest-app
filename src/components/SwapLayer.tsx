/**
 * Flying-tape animation layer. Renders one or more "flights" — each a tape
 * arcing between two points while rotating/scaling (flat ⇆ upright). Used for
 * swapping (2 flights), inserting, and ejecting (1 flight). All coordinates are
 * local to the home root (already offset-corrected by the caller).
 */
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import VhsTape from '@/components/VhsTape';
import { fill } from '@/lib/theme';

type Pt = { x: number; y: number };

export type Flight = {
  key: string;
  tape: { title: string; accent: string };
  from: Pt;
  to: Pt;
  fromRot: number;
  toRot: number;
  fromScale: number;
  toScale: number;
};

function Flyer({ flight, w, h, progress }: { flight: Flight; w: number; h: number; progress: SharedValue<number> }) {
  const { from, to, fromRot, toRot, fromScale, toScale, tape } = flight;
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

export default function SwapLayer({ flights, w, h, progress }: { flights: Flight[]; w: number; h: number; progress: SharedValue<number> }) {
  return (
    <View style={[fill, { zIndex: 150 }]} pointerEvents="none">
      {flights.map((f) => (
        <Flyer key={f.key} flight={f} w={w} h={h} progress={progress} />
      ))}
    </View>
  );
}
