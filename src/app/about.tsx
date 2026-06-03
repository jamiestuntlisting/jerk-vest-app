import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Screen from '@/components/Screen';
import { ABOUT, SITE, type Person } from '@/lib/content';
import { openExternal } from '@/lib/links';
import { colors, fonts, glow, rgba, space } from '@/lib/theme';

function PersonCard({ person }: { person: Person }) {
  const accent = person.accent === 'orange' ? colors.orange : colors.purpleLight;
  return (
    <View style={[styles.person, { borderColor: rgba(accent, 0.5) }]}>
      <LinearGradient
        colors={[rgba(accent, 0.22), 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.initials, { borderColor: accent, ...glow(accent, 14, 0.5) }]}>
        <Text style={[styles.initialsText, { color: accent }]}>{person.initials}</Text>
      </View>
      <View style={styles.personBody}>
        <Text style={styles.name}>{person.name}</Text>
        <View style={[styles.uniqueTag, { backgroundColor: rgba(accent, 0.18), borderColor: accent }]}>
          <Text style={[styles.uniqueText, { color: accent }]}>{person.unique}</Text>
        </View>
        <Text style={styles.roles}>{person.roles}</Text>
        {person.ig ? (
          <Pressable onPress={() => openExternal(`https://instagram.com/${person.ig}`, `ig_${person.ig}`)} hitSlop={8}>
            <Text style={[styles.ig, { color: accent }]}>@{person.ig}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function ContactButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.contactBtn, pressed && { opacity: 0.7 }]}>
      <Text style={styles.contactText}>{label}</Text>
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

      <View style={styles.contactRow}>
        <ContactButton label="EMAIL" onPress={() => openExternal(`mailto:${SITE.email}`, 'email')} />
        <ContactButton label="INSTAGRAM" onPress={() => openExternal(SITE.instagram, 'about_instagram')} />
        <ContactButton label="YOUTUBE" onPress={() => openExternal(SITE.youtube, 'about_youtube')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontFamily: fonts.body, color: colors.textDim, fontSize: 14, lineHeight: 21, marginBottom: space.xl },
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
  initials: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.black, 0.35),
  },
  initialsText: { fontFamily: fonts.display, fontSize: 26 },
  personBody: { flex: 1 },
  name: { fontFamily: fonts.display, color: colors.textBright, fontSize: 24, letterSpacing: 0.5, transform: [{ skewX: '-6deg' }] },
  uniqueTag: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6, marginBottom: 8 },
  uniqueText: { fontFamily: fonts.heading, fontSize: 11, letterSpacing: 1.5 },
  roles: { fontFamily: fonts.body, color: colors.textDim, fontSize: 12.5, lineHeight: 18 },
  ig: { fontFamily: fonts.bodySemiBold, fontSize: 13, marginTop: 8 },
  shared: { alignItems: 'center', marginVertical: space.md },
  sharedLabel: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 4, fontSize: 12, marginBottom: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.sm },
  chip: {
    borderWidth: 1,
    borderColor: rgba(colors.orange, 0.6),
    backgroundColor: rgba(colors.orange, 0.1),
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: { fontFamily: fonts.bodySemiBold, color: colors.orangeLight, fontSize: 12.5 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.sm, marginTop: space.xl },
  contactBtn: {
    borderWidth: 1,
    borderColor: rgba(colors.purpleLight, 0.6),
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: rgba(colors.purpleDeep, 0.5),
  },
  contactText: { fontFamily: fonts.heading, color: colors.textBright, letterSpacing: 2, fontSize: 13 },
});
