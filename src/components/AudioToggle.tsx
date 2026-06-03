/**
 * Menu audio control.
 *
 * Audio is intentionally OFF by default (no autoplay) — the user can turn it
 * on. The actual track is pluggable via EXPO_PUBLIC_MENU_AUDIO_URL so a loop
 * can be dropped in later without touching code; until then this still renders
 * and the toggle is wired (and tracked), it just has nothing to play yet.
 */
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

import { track } from '@/lib/analytics';
import { colors, glow, rgba } from '@/lib/theme';
import { MENU_AUDIO_URL } from '@/lib/config';

const AUDIO_URL = MENU_AUDIO_URL;

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <View style={styles.icon} pointerEvents="none">
      <View style={styles.neck} />
      <View style={styles.cone} />
      {on ? (
        <>
          <View style={[styles.wave, { width: 7, height: 7 }]} />
          <View style={[styles.wave, { width: 12, height: 12, left: 13 }]} />
        </>
      ) : (
        <View style={styles.muteSlash} />
      )}
    </View>
  );
}

export default function AudioToggle() {
  const [on, setOn] = useState(false);
  const player = useAudioPlayer(AUDIO_URL ? { uri: AUDIO_URL } : null);

  useEffect(() => {
    try {
      player.loop = true;
    } catch {
      /* no source yet */
    }
  }, [player]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    track('audio_toggle', { label: next ? 'on' : 'off' });
    try {
      if (next) player.play();
      else player.pause();
    } catch {
      /* no source loaded — toggle is still recorded */
    }
  };

  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={on ? 'Mute menu audio' : 'Unmute menu audio'}
      style={({ pressed }) => [styles.btn, on && styles.btnOn, pressed && { opacity: 0.7 }]}>
      <SpeakerIcon on={on} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.purpleDeep, 0.6),
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.4),
  },
  btnOn: { borderColor: colors.orange, ...glow(colors.orange, 12, 0.7) },
  icon: { width: 26, height: 18, justifyContent: 'center' },
  neck: { position: 'absolute', left: 0, width: 4, height: 9, backgroundColor: colors.white, borderRadius: 1 },
  cone: {
    position: 'absolute',
    left: 3,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderRightWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.white,
  },
  wave: {
    position: 'absolute',
    left: 11,
    borderColor: 'transparent',
    borderRightColor: colors.orangeLight,
    borderWidth: 2,
    borderRadius: 12,
  },
  muteSlash: {
    position: 'absolute',
    left: 12,
    width: 16,
    height: 2,
    backgroundColor: colors.orangeLight,
    transform: [{ rotateZ: '45deg' }],
  },
});
