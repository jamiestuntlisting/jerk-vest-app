import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Screen from '@/components/Screen';
import VideoCard from '@/components/VideoCard';
import { SITE, TRAILERS } from '@/lib/content';
import { openExternal } from '@/lib/links';
import { colors, fonts, glow, rgba, space } from '@/lib/theme';

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.section}>{children}</Text>;
}

export default function MoreScreen() {
  return (
    <Screen title="MORE" eyebrow="EXTRAS">
      <SectionTitle>TRAILERS</SectionTitle>
      {TRAILERS.map((item) => (
        <VideoCard key={item.id} item={item} />
      ))}

      <SectionTitle>MERCH</SectionTitle>
      <Pressable onPress={() => openExternal(SITE.shop, 'more_shop')} style={({ pressed }) => [styles.merch, pressed && { opacity: 0.85 }]}>
        <LinearGradient
          colors={[colors.orange, colors.orangeDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.merchTitle}>OFFICIAL JERK VEST SHOP</Text>
        <Text style={styles.merchSub}>Apparel, accessories, and the Dodge Brick collection ↗</Text>
      </Pressable>

      <SectionTitle>PRESS &amp; CONTACT</SectionTitle>
      <View style={styles.linkCol}>
        <LinkRow label="Email us" value={SITE.email} onPress={() => openExternal(`mailto:${SITE.email}`, 'more_email')} />
        <LinkRow label="Instagram" value="@JERKVEST" onPress={() => openExternal(SITE.instagram, 'more_instagram')} />
        <LinkRow label="YouTube" value="@JerkVest" onPress={() => openExternal(SITE.youtube, 'more_youtube')} />
      </View>
    </Screen>
  );
}

function LinkRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}>
      <Text style={styles.linkLabel}>{label}</Text>
      <Text style={styles.linkValue}>{value} ↗</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    fontFamily: fonts.heading,
    color: colors.purpleGlow,
    letterSpacing: 3,
    fontSize: 16,
    marginTop: space.md,
    marginBottom: space.md,
  },
  merch: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
    marginBottom: space.lg,
    ...glow(colors.orange, 18, 0.5),
  },
  merchTitle: { fontFamily: fonts.display, color: colors.white, fontSize: 24, letterSpacing: 1, transform: [{ skewX: '-6deg' }] },
  merchSub: { fontFamily: fonts.bodyMedium, color: rgba(colors.white, 0.9), fontSize: 13, marginTop: 6 },
  linkCol: { gap: space.sm },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.tileBg,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  linkLabel: { fontFamily: fonts.bodySemiBold, color: colors.textBright, fontSize: 14 },
  linkValue: { fontFamily: fonts.bodyMedium, color: colors.orangeLight, fontSize: 13 },
});
