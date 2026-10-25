import { gu } from '../../i18n/gu';
import type { Video } from '../../schema/content';
import { GuText } from '../GuText';
import { VideoPlayer } from '../VideoPlayer';

/**
 * Step 2: approved videos first, then the written lesson. Never blocks the lesson (pending.md V.1):
 * with no approved video she sees the placeholder and goes on.
 */
export function VideoStep({ videos }: { videos: readonly Video[] }) {
  if (videos.length === 0) {
    return (
      <p className="bg-surface rounded-xl border border-black/10 p-3">
        {gu.topic.noVideo}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <p>{gu.lesson.video.hint}</p>
      {videos.map((video) => (
        <section key={video.id} className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">
            <GuText text={video.titleGu} />
          </h3>
          <p>
            <GuText text={video.aboutGu} />
          </p>
          <VideoPlayer video={video} />
        </section>
      ))}
    </div>
  );
}
