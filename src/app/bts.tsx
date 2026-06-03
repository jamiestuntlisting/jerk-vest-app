import { StyleSheet, Text } from 'react-native';

import Screen from '@/components/Screen';
import VideoCard from '@/components/VideoCard';
import { BTS } from '@/lib/content';
import { colors, fonts, space } from '@/lib/theme';

export default function BtsScreen() {
  return (
    <Screen title="BTS" eyebrow="BEHIND THE SCENES">
      <Text style={styles.intro}>
        Making-ofs, on-set chaos, and bloopers. How the stunts, the gorilla, and everything in
        between actually came together.
      </Text>
      {BTS.map((item) => (
        <VideoCard key={item.id} item={item} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontFamily: fonts.body,
    color: colors.textDim,
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: space.lg,
  },
});
