import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Screen from '@/components/Screen';
import { ABOUT, type Person } from '@/lib/content';
import { colors, fonts, glow, fill, rgba, space } from '@/lib/theme';

function PersonCard({ person }: { person: Person }) {
  const accent = person.accent === 'orange' ? colors.orange : colors.purpleLight;
  return (
    <View style={[styles.person, { borderColor: rgba(accent, 0.5) }]}>
      <LinearGradient colors={[rgba(accent, 0.22), 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={fill} />
      <View style={[styles.initials, { borderColor: accent, ...glow(accent, 14, 0.5) }]}>
        <Text style={[styles.initialsText, { color: accent }]}>{person.initials}</Text>
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
  initials: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rgba(colors.black, 0.35),
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
});
