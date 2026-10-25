import { Link } from 'react-router';
import { GuText } from '../components/GuText';
import { Page } from '../components/Page';
import { gu } from '../i18n/gu';
import { lessonsOfTopic } from '../lib/content';
import { isPhaseUnlocked } from '../lib/unlock';
import { getContent } from '../services/content';
import { useProgress } from '../state/progressContext';

export function LearnPage() {
  const content = getContent();
  const { progress } = useProgress();

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
          {!isPhaseUnlocked(content, progress, phase.id) && (
            <p className="mb-3 font-bold">{gu.learn.phaseLocked}</p>
          )}
          <ol className="flex flex-col gap-2">
            {phase.topics.map((topic) => {
              const lessons = lessonsOfTopic(content, topic.id);
              const done = lessons.filter(
                (l) => progress.lessons[l.id]?.status === 'completed',
              ).length;
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
                        {lessons.length > 0
                          ? `${gu.learn.lessonCount(lessons.length)} · ${gu.learn.completedCount(done, lessons.length)}`
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
