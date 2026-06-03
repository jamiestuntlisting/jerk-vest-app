/**
 * A project / video card used on Movies, BTS and More.
 * - On web, tapping a YouTube item expands an inline player.
 * - On native (and for frame.io / Instagram embeds) it opens externally.
 * - Credits collapse/expand so the cards stay tidy.
 */
import { createElement, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import type { VideoItem } from '@/lib/content';
import { track } from '@/lib/analytics';
import { openExternal } from '@/lib/links';
import { colors, fonts, glow, fill, rgba, space } from '@/lib/theme';

function YouTubeFrame({ id }: { id: string }) {
  // RN-Web renders to the DOM, so a real <iframe> is fine here (web only).
  return createElement('iframe', {
    src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
    style: { width: '100%', height: '100%', border: 0, borderRadius: 12 },
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen: true,
  });
}

export default function VideoCard({ item }: { item: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const watchUrl = item.youtubeId
    ? `https://www.youtube.com/watch?v=${item.youtubeId}`
    : item.embedUrl;
  const playable = !!(item.youtubeId || item.embedUrl);

  const onPlay = () => {
    if (!playable) return;
    track('video_play', { label: item.id, meta: { title: item.title } });
    if (Platform.OS === 'web' && item.youtubeId) {
      setPlaying(true);
    } else if (watchUrl) {
      void openExternal(watchUrl, item.id);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        {playing && item.youtubeId ? (
          <YouTubeFrame id={item.youtubeId} />
        ) : (
          <Pressable onPress={onPlay} style={styles.mediaInner} disabled={!playable}>
            {item.thumb ? (
              <Image source={{ uri: item.thumb }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
            ) : (
              <LinearGradient colors={[colors.purpleDark, colors.purpleDeep]} style={StyleSheet.absoluteFill} />
            )}
            <LinearGradient colors={['transparent', rgba(colors.black, 0.55)]} style={StyleSheet.absoluteFill} />

            {!item.thumb ? <Text style={styles.placeholderMark}>JV</Text> : null}

            {playable ? (
              <View style={styles.playBtn}>
                <View style={styles.playTri} />
              </View>
            ) : null}

            {item.status ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
              </View>
            ) : null}
          </Pressable>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        {item.credits?.length ? (
          <View style={styles.creditsWrap}>
            <Pressable onPress={() => setShowCredits((s) => !s)} hitSlop={8}>
              <Text style={styles.creditsToggle}>{showCredits ? '▾ Hide credits' : '▸ Full credits'}</Text>
            </Pressable>
            {showCredits
              ? item.credits.map((c) => (
                  <View key={c.role} style={styles.creditRow}>
                    <Text style={styles.creditRole}>{c.role}</Text>
                    <Text style={styles.creditPeople}>{c.people.map((p) => p.name).join(' · ')}</Text>
                  </View>
                ))
              : null}
          </View>
        ) : null}

        {!playing && playable && Platform.OS === 'web' && !item.youtubeId ? (
          <Text style={styles.watchHint}>Opens externally ↗</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tileBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    overflow: 'hidden',
    marginBottom: space.lg,
  },
  media: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.purpleDeep },
  mediaInner: { ...fill, alignItems: 'center', justifyContent: 'center' },
  placeholderMark: { fontFamily: fonts.display, color: rgba(colors.purpleGlow, 0.5), fontSize: 54, transform: [{ skewX: '-8deg' }] },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.orange, 0.92),
    ...glow(colors.orange, 18, 0.7),
  },
  playTri: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: rgba(colors.black, 0.7),
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontFamily: fonts.heading, color: colors.orange, fontSize: 10, letterSpacing: 1.5 },
  info: { padding: space.lg },
  title: { fontFamily: fonts.display, color: colors.textBright, fontSize: 24, letterSpacing: 0.5, transform: [{ skewX: '-6deg' }] },
  desc: { fontFamily: fonts.body, color: colors.textDim, fontSize: 13, lineHeight: 19, marginTop: 6 },
  creditsWrap: { marginTop: 12 },
  creditsToggle: { fontFamily: fonts.bodySemiBold, color: colors.orangeLight, fontSize: 12.5 },
  creditRow: { marginTop: 8 },
  creditRole: { fontFamily: fonts.heading, color: colors.purpleGlow, fontSize: 12, letterSpacing: 1.5 },
  creditPeople: { fontFamily: fonts.body, color: colors.textDim, fontSize: 12.5, lineHeight: 18, marginTop: 1 },
  watchHint: { fontFamily: fonts.bodyMedium, color: colors.textFaint, fontSize: 11, marginTop: 10 },
});
