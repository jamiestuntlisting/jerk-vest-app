import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import Screen from '@/components/Screen';
import { ABOUT, SITE, type Person } from '@/lib/content';
import { openExternal } from '@/lib/links';
import { colors, fonts, glow, fill, rgba, space } from '@/lib/theme';

function PersonCard({ person }: { person: Person }) {
  const accent = person.accent === 'orange' ? colors.orange : colors.purpleLight;
  return (
    <View style={[styles.person, { borderColor: rgba(accent, 0.5) }]}>
      <LinearGradient colors={[rgba(accent, 0.22), 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={fill} />
      <View style={[styles.headshot, { borderColor: accent, ...glow(accent, 14, 0.5) }]}>
        {person.headshot ? (
          <Image source={{ uri: person.headshot }} style={fill} contentFit="cover" transition={200} />
        ) : (
          <Text style={[styles.initialsText, { color: accent }]}>{person.initials}</Text>
        )}
      </View>
      <View style={styles.personBody}>
        <Text style={styles.name}>{person.name}</Text>
        <View style={[styles.uniqueTag, { backgroundColor: rgba(accent, 0.18), borderColor: accent }]}>
          <Text style={[styles.uniqueText, { color: accent }]}>{person.unique}</Text>
        </View>
        <Text style={styles.roles}>{person.roles}</Text>
        {person.ig ? <Text style={[styles.ig, { color: accent }]}>@{person.ig}</Text> : null}
      </View>
    </View>
  );
}

function ContactRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </Pressable>
  );
}

export default function AboutScreen() {
  return (
    <Screen title="ABOUT US" eyebrow="WHO WE ARE">
      <Text style={styles.intro}>{ABOUT.intro}</Text>

      {ABOUT.people.map((p) => (
        <PersonCard key={p.initials} person={p} />
      ))}

      <View style={styles.shared}>
        <Text style={styles.sharedLabel}>WHERE WE OVERLAP</Text>
        <View style={styles.chips}>
          {ABOUT.shared.map((s) => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.contactHeader}>GET IN TOUCH</Text>
      <View style={styles.contactList}>
        <ContactRow label="EMAIL" value={SITE.email} onPress={() => openExternal(`mailto:${SITE.email}`, 'contact_email')} />
        <ContactRow label="INSTAGRAM" value="@JERKVEST" onPress={() => openExternal(SITE.instagram, 'contact_instagram')} />
        <ContactRow label="YOUTUBE" value="@JerkVest" onPress={() => openExternal(SITE.youtube, 'contact_youtube')} />
        <ContactRow label="SHOP" value="Dodge Brick collection" onPress={() => openExternal(SITE.shop, 'contact_shop')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontFamily: fonts.body, color: colors.textBright, fontSize: 17, lineHeight: 25, marginBottom: space.xl },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tileBg,
    borderWidth: 1,
    borderRadius: 18,
    padding: space.lg,
    marginBottom: space.lg,
    overflow: 'hidden',
    gap: space.lg,
  },
  headshot: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.black, 0.35),
    overflow: 'hidden',
  },
  initialsText: { fontFamily: fonts.display, fontSize: 32 },
  personBody: { flex: 1 },
  name: { fontFamily: fonts.display, color: colors.textBright, fontSize: 30, letterSpacing: 0.5, transform: [{ skewX: '-6deg' }] },
  uniqueTag: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8, marginBottom: 10 },
  uniqueText: { fontFamily: fonts.heading, fontSize: 13, letterSpacing: 1.5 },
  roles: { fontFamily: fonts.body, color: colors.textDim, fontSize: 15, lineHeight: 21 },
  ig: { fontFamily: fonts.bodySemiBold, fontSize: 15, marginTop: 10 },
  shared: { alignItems: 'center', marginVertical: space.lg },
  sharedLabel: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 4, fontSize: 15, marginBottom: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.sm },
  chip: {
    borderWidth: 1,
    borderColor: rgba(colors.orange, 0.6),
    backgroundColor: rgba(colors.orange, 0.1),
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: { fontFamily: fonts.bodySemiBold, color: colors.orangeLight, fontSize: 15 },
  contactHeader: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 3, fontSize: 18, marginTop: space.lg, marginBottom: space.md },
  contactList: { gap: space.sm },
  row: {
    backgroundColor: colors.tileBg,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  rowLabel: { fontFamily: fonts.heading, color: colors.orange, letterSpacing: 2, fontSize: 16, marginBottom: 2 },
  rowValue: { fontFamily: fonts.bodyMedium, color: colors.textBright, fontSize: 16 },
});
