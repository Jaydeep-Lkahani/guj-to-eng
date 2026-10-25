import { Link } from 'react-router';
import { gu } from '../../i18n/gu';
import { AudioButton } from '../AudioButton';
import { ButtonLink } from '../ButtonLink';
import { En } from '../En';
import { GuText } from '../GuText';

/** Step 9: one real-life sentence to use at home, and the lesson-done message. */
export function UseTodayStep({
  useToday,
  topicId,
  nextLessonId,
}: {
  useToday: { en: string; gu: string };
  topicId: string;
  nextLessonId: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="text-success text-2xl font-bold">
        {gu.glossary.wellDone} {gu.lesson.useToday.completed}
      </p>
      <section className="bg-surface flex flex-col gap-2 rounded-xl border border-black/10 p-3">
        <h3 className="text-xl font-bold">{gu.lesson.useToday.title}</h3>
        <p className="flex items-center justify-between gap-3">
          <En className="font-bold">{useToday.en}</En>
          <AudioButton text={useToday.en} />
        </p>
        <p>
          <GuText text={useToday.gu} />
        </p>
      </section>
      <div className="flex flex-wrap gap-2">
        {nextLessonId && (
          <ButtonLink to={`/lesson/${nextLessonId}`}>
            {gu.lesson.useToday.nextLesson}
          </ButtonLink>
        )}
        <Link
          to={`/topic/${topicId}`}
          className="bg-surface text-primary inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-black/15 px-6 font-bold"
        >
          {gu.lesson.backToTopic}
        </Link>
      </div>
    </div>
  );
}
