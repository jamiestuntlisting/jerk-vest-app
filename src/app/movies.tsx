import Screen from '@/components/Screen';
import VideoCard from '@/components/VideoCard';
import { MOVIES } from '@/lib/content';

export default function MoviesScreen() {
  return (
    <Screen title="MOVIES" eyebrow="OUR FILMS">
      {MOVIES.map((item) => (
        <VideoCard key={item.id} item={item} />
      ))}
    </Screen>
  );
}
