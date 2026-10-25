import { useParams } from 'react-router';
import { ButtonLink } from '../components/ButtonLink';
import { LessonPlayer } from '../components/lesson/LessonPlayer';
import { Page } from '../components/Page';
import { gu } from '../i18n/gu';
import { findLesson } from '../lib/content';
import { lessonLock } from '../lib/unlock';
import { getContent } from '../services/content';
import { useProgress } from '../state/progressContext';

export function LessonPage() {
  const { lessonId } = useParams();
  const content = getContent();
  const { progress } = useProgress();
  const lesson = lessonId ? findLesson(content, lessonId) : undefined;
  const lock = lesson ? lessonLock(content, progress, lesson.id) : undefined;

  if (!lesson || !lock) {
    return (
      <Page title={gu.lesson.notFoundTitle}>
        <p className="mb-6">{gu.lesson.notFoundMessage}</p>
        <ButtonLink to="/learn">{gu.glossary.learn}</ButtonLink>
      </Page>
    );
  }

  if (!lock.unlocked) {
    return (
      <Page title={gu.lesson.lockedTitle}>
        <p className="mb-6">{gu.lesson.lockReason[lock.reason]}</p>
        <ButtonLink to={`/topic/${lesson.topicId}`}>
          {gu.lesson.backToTopic}
        </ButtonLink>
      </Page>
    );
  }

  return (
    <Page title={lesson.titleGu}>
      <LessonPlayer key={lesson.id} lesson={lesson} />
    </Page>
  );
}
