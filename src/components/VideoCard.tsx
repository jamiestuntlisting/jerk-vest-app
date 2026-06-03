/**
 * A project / video card used on Movies and BTS.
 * - On web, tapping a playable item expands an inline player (YouTube or
 *   Instagram embed) — no new tab, no redirect.
 * - On native it opens the source.
 * - Items with no cut yet show a "coming soon" status card.
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

function InlineFrame({ src }: { src: string }) {
  // RN-Web renders to the DOM, so a real <iframe> is fine here (web only).
  return createElement('iframe', {
    src,
    style: { width: '100%', height: '100%', border: 0, borderRadius: 12 },
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullScreen: true,
  });
}

export default function VideoCard({ item }: { item: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const embedSrc = item.youtubeId
    ? `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0&playsinline=1`
    : item.embedUrl;
  const nativeUrl = item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : item.embedUrl;
  const playable = !!embedSrc;

  const onPlay = () => {
    if (!playable) return;
    track('video_play', { label: item.id, meta: { title: item.title } });
    if (Platform.OS === 'web') setPlaying(true);
    else if (nativeUrl) void openExternal(nativeUrl, item.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.media}>
        {playing && embedSrc ? (
          <InlineFrame src={embedSrc} />
        ) : (
          <Pressable onPress={onPlay} style={styles.mediaInner} disabled={!playable}>
            {item.thumb ? (
              <Image source={{ uri: item.thumb }} style={fill} contentFit="cover" transition={250} />
            ) : (
              <LinearGradient colors={[colors.purpleDark, colors.purpleDeep]} style={fill} />
            )}
            <LinearGradient colors={['transparent', rgba(colors.black, 0.55)]} style={fill} />

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
  placeholderMark: { fontFamily: fonts.display, color: rgba(colors.purpleGlow, 0.5), fontSize: 64, transform: [{ skewX: '-8deg' }] },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.orange, 0.92),
    ...glow(colors.orange, 18, 0.7),
  },
  playTri: {
    width: 0,
    height: 0,
    marginLeft: 5,
    borderTopWidth: 13,
    borderBottomWidth: 13,
    borderLeftWidth: 21,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: rgba(colors.black, 0.7),
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: fonts.heading, color: colors.orange, fontSize: 12, letterSpacing: 1.5 },
  info: { padding: space.lg },
  title: { fontFamily: fonts.display, color: colors.textBright, fontSize: 30, letterSpacing: 0.5, transform: [{ skewX: '-6deg' }] },
  desc: { fontFamily: fonts.body, color: colors.textDim, fontSize: 16, lineHeight: 23, marginTop: 8 },
  creditsWrap: { marginTop: 14 },
  creditsToggle: { fontFamily: fonts.bodySemiBold, color: colors.orangeLight, fontSize: 15 },
  creditRow: { marginTop: 10 },
  creditRole: { fontFamily: fonts.heading, color: colors.purpleGlow, fontSize: 14, letterSpacing: 1.5 },
  creditPeople: { fontFamily: fonts.body, color: colors.textDim, fontSize: 15, lineHeight: 21, marginTop: 2 },
});
