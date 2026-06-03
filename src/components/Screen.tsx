/**
 * Shared layout for the sub-pages (Movies, BTS, About, More, Admin).
 * Sticky back header + page title, then scrollable content. The animated
 * background and DVD frame come from the root layout, so this stays transparent.
 */
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { APP_MAX_WIDTH, colors, fonts, glow, rgba, space } from '@/lib/theme';

export default function Screen({
  title,
  eyebrow = 'SPECIAL FEATURE',
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={12} style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}>
          <View style={styles.chevron} />
          <Text style={styles.backText}>MENU</Text>
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {children}
        <View style={{ height: space.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: space.sm,
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 78 },
  chevron: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.orange,
  },
  backText: { fontFamily: fonts.heading, color: colors.orange, letterSpacing: 2, fontSize: 14 },
  titleWrap: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 78 },
  eyebrow: { fontFamily: fonts.heading, color: rgba(colors.purpleGlow, 0.85), letterSpacing: 4, fontSize: 10 },
  title: {
    fontFamily: fonts.display,
    color: colors.orange,
    fontSize: 30,
    letterSpacing: 1,
    transform: [{ skewX: '-8deg' }],
    ...glow(colors.orangeDeep, 10, 0.5),
  },
  scroll: { flex: 1 },
  content: { paddingHorizontal: space.lg, maxWidth: APP_MAX_WIDTH, width: '100%', alignSelf: 'center' },
});
