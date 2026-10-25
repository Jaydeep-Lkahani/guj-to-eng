import { Link } from 'react-router';
import { GuText } from '../components/GuText';
import { Page } from '../components/Page';
import { gu } from '../i18n/gu';
import { lessonsOfTopic } from '../lib/content';
import { getContent } from '../services/content';

export function LearnPage() {
  const content = getContent();

  return (
    <Page title={gu.pages.learn}>
      {content.phases.map((phase) => (
        <section
          key={phase.id}
          aria-labelledby={`phase-${phase.id}`}
          className="mb-8"
        >
          <h2 id={`phase-${phase.id}`} className="mb-1 text-xl font-bold">
            <GuText text={phase.titleGu} />
          </h2>
          <p className="text-muted mb-3">
            <GuText text={phase.goalGu} />
          </p>
          <ol className="flex flex-col gap-2">
            {phase.topics.map((topic) => {
              const lessonCount = lessonsOfTopic(content, topic.id).length;
              return (
                <li key={topic.id}>
                  <Link
                    to={`/topic/${topic.id}`}
                    className="bg-surface flex min-h-14 items-center gap-3 rounded-xl border border-black/10 px-4 py-2"
                  >
                    <span className="text-primary w-7 shrink-0 text-center font-bold">
                      {topic.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">
                        <GuText text={topic.titleGu} />
                      </span>
                      <span className="text-muted block">
                        {lessonCount > 0
                          ? gu.learn.lessonCount(lessonCount)
                          : gu.learn.lessonsComingSoon}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </Page>
  );
}
