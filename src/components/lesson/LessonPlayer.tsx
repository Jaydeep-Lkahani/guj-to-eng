import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gu } from '../../i18n/gu';
import {
  findTopic,
  isFirstLessonOfTopic,
  lessonVideos,
  phaseOfLesson,
  approvedVideos,
} from '../../lib/content';
import { nowIso, today } from '../../lib/dates';
import type { Grade } from '../../lib/grading';
import {
  nextStep,
  PASS_SCORE,
  previousStep,
  startStep,
  STEP,
  visibleSteps,
  type StepNumber,
} from '../../lib/lessonSteps';
import { translitMode } from '../../lib/translit';
import { buildWarmup } from '../../lib/warmup';
import type { Exercise, Lesson } from '../../schema/content';
import { getContent } from '../../services/content';
import { useProgress } from '../../state/progressContext';
import { BlockView } from './BlockView';
import { ExamplesStep } from './ExamplesStep';
import { PracticeStep } from './PracticeStep';
import { QuizStep } from './QuizStep';
import { SpeakStep } from './SpeakStep';
import { StepNav } from './StepNav';
import { StepProgress } from './StepProgress';
import { UseTodayStep } from './UseTodayStep';
import { VideoStep } from './VideoStep';
import { WarmupStep } from './WarmupStep';
import { WriteStep } from './WriteStep';
import { TtsNotice } from '../TtsNotice';

/**
 * The lesson player: the 9 steps of pending.md section 0, saved step by step so that opening the
 * lesson again resumes where she stopped. Give it a `key` of the lesson id.
 */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const content = getContent();
  const { progress, dispatch } = useProgress();
  const phase = phaseOfLesson(content, lesson.id);
  const topic = findTopic(content, lesson.topicId)?.topic;
  const translit = translitMode(progress.settings.transliteration, phase?.id);

  // Built once, when the lesson opens: finishing a step must not change the review.
  const [warmup] = useState(() =>
    buildWarmup(content, progress, lesson.id, today()),
  );
  const videos = lessonVideos(content, lesson);
  const hasVideoStep =
    isFirstLessonOfTopic(content, lesson) || videos.length > 0;
  const visible = visibleSteps({ hasWarmup: warmup.length > 0, hasVideoStep });

  const [step, setStep] = useState(() =>
    startStep(visible, progress.lessons[lesson.id]),
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // A lesson that is opened for the first time is saved as "in progress".
  const started = progress.lessons[lesson.id] !== undefined;
  useEffect(() => {
    if (!started) dispatch({ type: 'setStep', lessonId: lesson.id, step });
  }, [started, dispatch, lesson.id, step]);

  // After moving to another step, focus its heading so screen readers and the page start there.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
    moved.current = true;
  }, [step]);

  const goTo = useCallback(
    (target: number | undefined) => {
      if (target === undefined) return;
      setStep(target);
      dispatch({ type: 'setStep', lessonId: lesson.id, step: target });
    },
    [dispatch, lesson.id],
  );
  const next = () => goTo(nextStep(step, visible));
  const back =
    previousStep(step, visible) === undefined
      ? undefined
      : () => goTo(previousStep(step, visible));

  const recordMistake = (exercise: Exercise, grade: Grade) => {
    if (!grade.mistake) return;
    dispatch({
      type: 'addMistake',
      mistake: {
        exerciseId: exercise.id,
        lessonId: lesson.id,
        answer: grade.answerText,
        at: nowIso(),
      },
    });
  };
  const finishQuiz = (score: number) => {
    dispatch({ type: 'recordQuiz', lessonId: lesson.id, score });
    if (score >= PASS_SCORE) {
      dispatch({
        type: 'completeLesson',
        lessonId: lesson.id,
        estimatedMinutes: lesson.estimatedMinutes,
        newWordIds: lesson.newWordIds,
        today: today(),
        at: nowIso(),
      });
    }
  };

  const order = phase?.recommendedOrder ?? [];
  const nextLessonId = order[order.indexOf(lesson.id) + 1];
  const topicHasVideos = topic
    ? approvedVideos(content, topic.videoIds).length > 0
    : false;

  let body;
  switch (step) {
    case STEP.warmup:
      body = <WarmupStep items={warmup} translit={translit} onNext={next} />;
      break;
    case STEP.video:
      body = <VideoStep videos={videos} />;
      break;
    case STEP.explanation:
      body = (
        <div>
          {!hasVideoStep && topicHasVideos && (
            <p className="mb-4">
              <Link
                to={`/topic/${lesson.topicId}`}
                className="text-primary font-bold underline"
              >
                {gu.lesson.watchTopicVideosAgain}
              </Link>
            </p>
          )}
          {lesson.explanation.map((block, i) => (
            <BlockView key={i} block={block} translit={translit} />
          ))}
        </div>
      );
      break;
    case STEP.examples:
      body = <ExamplesStep examples={lesson.examples} translit={translit} />;
      break;
    case STEP.practice:
      body = (
        <PracticeStep
          exercises={lesson.practice}
          onChecked={recordMistake}
          onDone={next}
        />
      );
      break;
    case STEP.speak:
      body = <SpeakStep items={lesson.speak} translit={translit} />;
      break;
    case STEP.write:
      body = <WriteStep tasks={lesson.write} />;
      break;
    case STEP.quiz:
      body = (
        <QuizStep
          exercises={lesson.quiz}
          onChecked={recordMistake}
          onFinished={finishQuiz}
          onContinue={() => goTo(STEP.useToday)}
          onReread={() => goTo(STEP.explanation)}
        />
      );
      break;
    default:
      body = (
        <UseTodayStep
          useToday={lesson.useToday}
          topicId={lesson.topicId}
          nextLessonId={nextLessonId}
        />
      );
  }

  // Steps with their own buttons (practice, quiz, warm-up, use-today) do not get the common ones.
  const ownButtons: number[] = [
    STEP.warmup,
    STEP.practice,
    STEP.quiz,
    STEP.useToday,
  ];
  const showNav = !ownButtons.includes(step);

  return (
    <div>
      <TtsNotice />
      <StepProgress
        position={visible.indexOf(step) + 1}
        total={visible.length}
      />
      <h2
        ref={heading}
        tabIndex={-1}
        className="mb-4 text-xl font-bold outline-none"
      >
        {gu.lesson.stepNames[step as StepNumber]}
      </h2>
      {body}
      {showNav && <StepNav onBack={back} onNext={next} />}
    </div>
  );
}
