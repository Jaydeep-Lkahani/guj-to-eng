import { addDays } from '../lib/dates';
import {
  MAX_MISTAKES,
  MAX_WRITINGS_PER_TASK,
  type DayProgress,
  type LessonProgress,
  type Mistake,
  type Progress,
} from '../schema/progress';

/**
 * Every change to the learner's progress. All values that depend on the clock (today, at)
 * come in with the action, so the reducer stays pure and easy to test.
 */
export type ProgressAction =
  | { type: 'replace'; progress: Progress }
  | { type: 'setStep'; lessonId: string; step: number }
  | { type: 'recordQuiz'; lessonId: string; score: number }
  | {
      type: 'completeLesson';
      lessonId: string;
      estimatedMinutes: number;
      newWordIds: readonly string[];
      today: string;
      at: string;
    }
  | { type: 'addMistake'; mistake: Mistake }
  | {
      type: 'setVideoProgress';
      videoId: string;
      lastPosition: number;
      duration: number;
      watched: boolean;
      today: string;
      at: string;
    }
  | { type: 'saveWriting'; taskId: string; text: string; at: string };

const EMPTY_DAY: DayProgress = { lessons: 0, reviews: 0, tests: 0, minutes: 0 };

function addToDay(
  progress: Progress,
  day: string,
  change: Partial<DayProgress>,
): Progress['days'] {
  const current = progress.days[day] ?? EMPTY_DAY;
  return {
    ...progress.days,
    [day]: {
      lessons: current.lessons + (change.lessons ?? 0),
      reviews: current.reviews + (change.reviews ?? 0),
      tests: current.tests + (change.tests ?? 0),
      minutes: current.minutes + (change.minutes ?? 0),
    },
  };
}

function lessonOrNew(progress: Progress, lessonId: string): LessonProgress {
  return (
    progress.lessons[lessonId] ?? {
      status: 'in_progress',
      step: 1,
      bestQuiz: 0,
      quizAttempts: 0,
    }
  );
}

export function progressReducer(
  progress: Progress,
  action: ProgressAction,
): Progress {
  switch (action.type) {
    case 'replace':
      return action.progress;

    case 'setStep': {
      const lesson = lessonOrNew(progress, action.lessonId);
      // A finished lesson stays finished; reading it again must not move it back.
      if (lesson.status === 'completed') return progress;
      return {
        ...progress,
        lessons: {
          ...progress.lessons,
          [action.lessonId]: { ...lesson, step: action.step },
        },
      };
    }

    case 'recordQuiz': {
      const lesson = lessonOrNew(progress, action.lessonId);
      return {
        ...progress,
        lessons: {
          ...progress.lessons,
          [action.lessonId]: {
            ...lesson,
            bestQuiz: Math.max(lesson.bestQuiz, action.score),
            quizAttempts: lesson.quizAttempts + 1,
          },
        },
      };
    }

    case 'completeLesson': {
      const lesson = lessonOrNew(progress, action.lessonId);
      // Only the first completion counts for words, minutes and days.
      if (lesson.status === 'completed') return progress;
      const tomorrow = addDays(action.today, 1);
      const srs = { ...progress.srs };
      for (const wordId of action.newWordIds) {
        srs[wordId] ??= { box: 1, due: tomorrow, right: 0, wrong: 0 };
      }
      return {
        ...progress,
        lessons: {
          ...progress.lessons,
          [action.lessonId]: {
            ...lesson,
            status: 'completed',
            step: 9,
            completedAt: action.at,
          },
        },
        srs,
        days: addToDay(progress, action.today, {
          lessons: 1,
          minutes: action.estimatedMinutes,
        }),
      };
    }

    case 'addMistake':
      return {
        ...progress,
        mistakes: [action.mistake, ...progress.mistakes].slice(0, MAX_MISTAKES),
      };

    case 'setVideoProgress': {
      const before = progress.videos[action.videoId];
      const newlyWatched = action.watched && !before?.watched;
      const watched = action.watched || before?.watched === true;
      const watchedAt =
        before?.watchedAt ?? (newlyWatched ? action.at : undefined);
      return {
        ...progress,
        videos: {
          ...progress.videos,
          [action.videoId]: {
            lastPosition: action.lastPosition,
            duration: action.duration,
            watched,
            ...(watchedAt === undefined ? {} : { watchedAt }),
          },
        },
        days: newlyWatched
          ? addToDay(progress, action.today, {
              minutes: Math.round(action.duration / 60),
            })
          : progress.days,
      };
    }

    case 'saveWriting': {
      const earlier = progress.writings[action.taskId] ?? [];
      return {
        ...progress,
        writings: {
          ...progress.writings,
          [action.taskId]: [
            ...earlier,
            { text: action.text, at: action.at },
          ].slice(-MAX_WRITINGS_PER_TASK),
        },
      };
    }
  }
}
