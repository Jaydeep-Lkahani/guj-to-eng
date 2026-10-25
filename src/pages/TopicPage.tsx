import { Link, useParams } from 'react-router';
import { ButtonLink } from '../components/ButtonLink';
import { GuText } from '../components/GuText';
import { Page } from '../components/Page';
import { gu } from '../i18n/gu';
import { approvedVideos, findTopic, lessonsOfTopic } from '../lib/content';
import { getContent } from '../services/content';

export function TopicPage() {
  const { topicId } = useParams();
  const content = getContent();
  const found = topicId ? findTopic(content, topicId) : undefined;

  if (!found) {
    return (
      <Page title={gu.topic.notFoundTitle}>
        <p className="mb-6">{gu.topic.notFoundMessage}</p>
        <ButtonLink to="/learn">{gu.glossary.learn}</ButtonLink>
      </Page>
    );
  }

  const { topic } = found;
  const videos = approvedVideos(content, topic.videoIds);
  const lessons = lessonsOfTopic(content, topic.id);

  return (
    <Page title={topic.titleGu}>
      <p className="mb-6">
        <GuText text={topic.introGu} />
      </p>

      <section aria-labelledby="topic-videos" className="mb-6">
        <h2 id="topic-videos" className="mb-2 text-xl font-bold">
          {gu.glossary.video}
        </h2>
        {videos.length === 0 ? (
          <p className="text-muted">{gu.topic.noVideo}</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {videos.map((video) => (
              <li key={video.id}>
                <GuText text={video.titleGu} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="topic-lessons">
        <h2 id="topic-lessons" className="mb-2 text-xl font-bold">
          {gu.glossary.lesson}
        </h2>
        {lessons.length === 0 ? (
          <p className="text-muted">{gu.topic.noLessons}</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="bg-surface flex min-h-14 items-center gap-3 rounded-xl border border-black/10 px-4 py-2"
                >
                  <span className="text-primary w-7 shrink-0 text-center font-bold">
                    {lesson.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">
                      <GuText text={lesson.titleGu} />
                    </span>
                    <span className="text-muted block">
                      {gu.topic.minutes(lesson.estimatedMinutes)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </Page>
  );
}
