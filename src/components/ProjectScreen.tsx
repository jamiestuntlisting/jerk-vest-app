/** Renders one movie/series page: intro, its videos, and an optional
 *  behind-the-scenes section. Shared by every project route. */
import { StyleSheet, Text } from 'react-native';

import Screen from '@/components/Screen';
import VideoCard from '@/components/VideoCard';
import type { Project } from '@/lib/content';
import { colors, fonts, space } from '@/lib/theme';

export default function ProjectScreen({ project }: { project: Project }) {
  return (
    <Screen title={project.title} eyebrow={project.eyebrow}>
      <Text style={styles.intro}>{project.intro}</Text>

      {project.videos.map((v) => (
        <VideoCard key={v.id} item={v} />
      ))}

      {project.bts?.length ? (
        <>
          <Text style={styles.section}>BEHIND THE SCENES</Text>
          {project.bts.map((v) => (
            <VideoCard key={v.id} item={v} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontFamily: fonts.body, color: colors.textBright, fontSize: 17, lineHeight: 25, marginBottom: space.xl },
  section: {
    fontFamily: fonts.heading,
    color: colors.purpleGlow,
    letterSpacing: 3,
    fontSize: 18,
    marginTop: space.sm,
    marginBottom: space.md,
  },
});
