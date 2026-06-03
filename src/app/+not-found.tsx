import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, glow, space } from '@/lib/theme';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.wrap}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.msg}>This scene got cut.</Text>
        <Link href="/" style={styles.link}>
          ◂ BACK TO MENU
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  code: { fontFamily: fonts.display, color: colors.orange, fontSize: 72, transform: [{ skewX: '-8deg' }], ...glow(colors.orangeDeep, 16, 0.6) },
  msg: { fontFamily: fonts.body, color: colors.textDim, fontSize: 15, marginTop: space.sm, marginBottom: space.xl },
  link: { fontFamily: fonts.heading, color: colors.purpleGlow, letterSpacing: 3, fontSize: 16 },
});
