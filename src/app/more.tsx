import { Pressable, StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/Screen';
import { SITE } from '@/lib/content';
import { openExternal } from '@/lib/links';
import { colors, fonts, rgba, space } from '@/lib/theme';

function ContactRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Pressable>
  );
}

export default function ContactScreen() {
  return (
    <Screen title="CONTACT" eyebrow="GET IN TOUCH">
      <Text style={styles.intro}>
        Bookings, press, collabs, or you just want to say what&apos;s up — here&apos;s where to find us.
      </Text>

      <View style={styles.list}>
        <ContactRow label="EMAIL" value={SITE.email} onPress={() => openExternal(`mailto:${SITE.email}`, 'contact_email')} />
        <ContactRow label="INSTAGRAM" value="@JERKVEST" onPress={() => openExternal(SITE.instagram, 'contact_instagram')} />
        <ContactRow label="YOUTUBE" value="@JerkVest" onPress={() => openExternal(SITE.youtube, 'contact_youtube')} />
        <ContactRow label="SHOP" value="Dodge Brick collection" onPress={() => openExternal(SITE.shop, 'contact_shop')} />
      </View>

      <Text style={styles.sign}>— Jerk Vest Productions</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontFamily: fonts.body, color: colors.textBright, fontSize: 17, lineHeight: 25, marginBottom: space.xl },
  list: { gap: space.md },
  row: {
    backgroundColor: colors.tileBg,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
  label: { fontFamily: fonts.heading, color: colors.orange, letterSpacing: 2, fontSize: 18, marginBottom: 3 },
  value: { fontFamily: fonts.bodyMedium, color: colors.textBright, fontSize: 17 },
  sign: { fontFamily: fonts.heading, color: colors.textFaint, letterSpacing: 2, fontSize: 14, marginTop: space.xxl, textAlign: 'center' },
});
