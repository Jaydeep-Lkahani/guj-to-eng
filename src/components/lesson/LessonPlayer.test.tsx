import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../../i18n/gu';
import { resetClock, setClock } from '../../lib/dates';
import { createEmptyProgress } from '../../lib/progress';
import type { Lesson } from '../../schema/content';
import { getContent } from '../../services/content';
import { SAVE_DELAY_MS } from '../../state/ProgressProvider';
import { answer, pressNext } from '../../test/doExercise';
import { MemoryStorage } from '../../test/memoryStorage';
import { renderAt } from '../../test/renderRoutes';

const LESSON_ID = 'p1-t01-l01';
const lesson = (): Lesson => {
  const found = getContent().lessonsByTopic['p1-t01']?.[0];
  if (!found) throw new Error('sample lesson missing');
  return found;
};

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  setClock(() => new Date(2026, 9, 25, 9, 0));
});

afterEach(() => {
  vi.useRealTimers();
  resetClock();
});

function open(storage = new MemoryStorage()) {
  const view = renderAt(`/lesson/${LESSON_ID}`, storage);
  return {
    ...view,
    user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }),
  };
}

const stepLabel = (n: number, total: number) => gu.lesson.stepLabel(n, total);
const stepHeading = () => screen.getByRole('heading', { level: 2 });
const flush = () =>
  act(() => {
    vi.advanceTimersByTime(SAVE_DELAY_MS + 10);
  });

/** Walks from the video step (step 2) to the quiz step. */
async function goToQuiz(user: ReturnType<typeof userEvent.setup>) {
  for (const heading of [
    gu.lesson.stepNames[2],
    gu.lesson.stepNames[3],
    gu.lesson.stepNames[4],
  ]) {
    expect(stepHeading()).toHaveTextContent(heading);
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
  }
  for (const exercise of lesson().practice) {
    await answer(user, exercise, true);
    await pressNext(user);
  }
  expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[6]);
  await user.click(screen.getByRole('button', { name: gu.glossary.next }));
  expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[7]);
  await user.click(screen.getByRole('button', { name: gu.glossary.next }));
  expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[8]);
}

describe('LessonPlayer', () => {
  it('opens a new lesson at the video step with the placeholder (no approved video) and saves it as in progress', () => {
    const { storage } = open();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      lesson().titleGu,
    );
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[2]);
    expect(screen.getByText(gu.topic.noVideo)).toBeInTheDocument();
    // The warm-up is skipped for the very first lesson: 8 steps are shown.
    expect(screen.getByText(stepLabel(1, 8))).toBeInTheDocument();
    flush();
    expect(storage.saved().lessons[LESSON_ID]).toMatchObject({
      status: 'in_progress',
      step: 2,
    });
  });

  it('walks through every step, completes the lesson and saves everything', async () => {
    const { user, storage } = open();
    await goToQuiz(user);

    for (const exercise of lesson().quiz) {
      await answer(user, exercise, true);
      await pressNext(user);
    }
    expect(screen.getByText(gu.lesson.quiz.score(5, 5))).toBeInTheDocument();
    expect(screen.getByText(gu.lesson.quiz.passed)).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: gu.glossary.continue }),
    );

    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[9]);
    expect(
      screen.getByText(gu.lesson.useToday.completed, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText(lesson().useToday.en)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: gu.lesson.backToTopic }),
    ).toHaveAttribute('href', '/topic/p1-t01');

    flush();
    const saved = storage.saved();
    expect(saved.lessons[LESSON_ID]).toMatchObject({
      status: 'completed',
      step: 9,
      bestQuiz: 5,
      quizAttempts: 1,
    });
    expect(Object.keys(saved.srs).sort()).toEqual(
      [...lesson().newWordIds].sort(),
    );
    expect(saved.srs['w-apple']).toMatchObject({ box: 1, due: '2026-10-26' });
    expect(saved.days['2026-10-25']).toMatchObject({
      lessons: 1,
      minutes: lesson().estimatedMinutes,
    });
    expect(saved.mistakes).toEqual([]);
  });

  it('saves wrong practice answers in the mistakes list, newest first', async () => {
    const { user, storage } = open();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    const [first, second] = lesson().practice;
    await answer(user, first!, false);
    await user.click(
      screen.getByRole('button', { name: gu.glossary.tryAgain }),
    );
    await answer(user, first!, true);
    await pressNext(user);
    await answer(user, second!, false);
    flush();

    const mistakes = storage.saved().mistakes;
    expect(mistakes.map((m) => m.exerciseId)).toEqual([second!.id, first!.id]);
    expect(mistakes[0]).toMatchObject({ lessonId: LESSON_ID });
  });

  it('resumes at the saved step', () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.lessons[LESSON_ID] = {
      status: 'in_progress',
      step: 5,
      bestQuiz: 0,
      quizAttempts: 0,
    };
    open(new MemoryStorage().seed(progress));
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[5]);
    expect(
      screen.getByText(gu.lesson.practice.counter(1, lesson().practice.length)),
    ).toBeInTheDocument();
  });

  it('saves the step when she moves on, and the back button goes to the step before', async () => {
    const { user, storage } = open();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[3]);
    flush();
    expect(storage.saved().lessons[LESSON_ID]?.step).toBe(3);
    await user.click(screen.getByRole('button', { name: gu.glossary.back }));
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[2]);
  });

  it('moves focus to the new step heading', async () => {
    const { user } = open();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(stepHeading()).toHaveFocus();
  });

  it('shows the explanation blocks with English in <En> and audio-free text when there is no voice', async () => {
    const { user } = open();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    const main = screen.getByRole('main');
    expect(within(main).getAllByRole('table')).toHaveLength(1);
    expect(main.querySelectorAll('[lang="en"]').length).toBeGreaterThan(10);
    expect(
      within(main).getByText(gu.glossary.commonMistake),
    ).toBeInTheDocument();
    // No English voice in the test browser, so one notice replaces the audio buttons.
    expect(
      within(main).queryAllByRole('button', { name: gu.audio.listen }),
    ).toHaveLength(0);
    expect(within(main).getByRole('note')).toBeInTheDocument();
  });

  it('shows the pronunciation help in Phase 1', async () => {
    const { user } = open();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(screen.getByText('(ઍપલ)')).toBeInTheDocument();
  });

  it('speaking and writing never block: next is always there', async () => {
    const { user } = open();
    for (let i = 0; i < 3; i++)
      await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    for (const exercise of lesson().practice) {
      await answer(user, exercise, true);
      await pressNext(user);
    }
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[6]);
    expect(
      screen.getByRole('button', { name: gu.glossary.next }),
    ).toBeEnabled();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[7]);
    expect(
      screen.getByRole('button', { name: gu.glossary.next }),
    ).toBeEnabled();
  });

  it('write step: typing is saved and the model answer shows only afterwards', async () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.lessons[LESSON_ID] = {
      status: 'in_progress',
      step: 7,
      bestQuiz: 0,
      quizAttempts: 0,
    };
    const { user, storage } = open(new MemoryStorage().seed(progress));
    const typeTask = lesson().write.find((t) => t.kind === 'type');
    expect(screen.queryByText(typeTask!.model!)).toBeNull();
    await user.type(screen.getByRole('textbox'), 'Apple ball cat');
    expect(
      screen.getByText(gu.lesson.write.wordCount(3), { exact: false }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: gu.lesson.write.submit }),
    );
    expect(screen.getByText(typeTask!.model!)).toBeInTheDocument();
    flush();
    expect(storage.saved().writings[typeTask!.id]?.[0]?.text).toBe(
      'Apple ball cat',
    );
  });

  it('write step: handwriting tasks show the letters', () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.lessons[LESSON_ID] = {
      status: 'in_progress',
      step: 7,
      bestQuiz: 0,
      quizAttempts: 0,
    };
    open(new MemoryStorage().seed(progress));
    expect(screen.getByText('ABCDE')).toBeInTheDocument();
    expect(screen.getByText('abcde')).toBeInTheDocument();
  });
});

describe('LessonPlayer quiz', () => {
  function seedAtQuiz() {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.lessons[LESSON_ID] = {
      status: 'in_progress',
      step: 8,
      bestQuiz: 0,
      quizAttempts: 0,
    };
    return new MemoryStorage().seed(progress);
  }

  async function answerQuiz(
    user: ReturnType<typeof userEvent.setup>,
    rights: boolean[],
  ) {
    for (const [i, exercise] of lesson().quiz.entries()) {
      await answer(user, exercise, rights[i] ?? false);
      await pressNext(user);
    }
  }

  it('completes the lesson with exactly 3 right answers', async () => {
    const { user, storage } = open(seedAtQuiz());
    await answerQuiz(user, [true, true, true, false, false]);
    expect(screen.getByText(gu.lesson.quiz.score(3, 5))).toBeInTheDocument();
    expect(screen.getByText(gu.lesson.quiz.passed)).toBeInTheDocument();
    flush();
    expect(storage.saved().lessons[LESSON_ID]).toMatchObject({
      status: 'completed',
      bestQuiz: 3,
    });
  });

  it('does not complete the lesson with 2 right answers, and offers quiz again or reading again', async () => {
    const { user, storage } = open(seedAtQuiz());
    await answerQuiz(user, [true, true, false, false, false]);
    expect(screen.getByText(gu.lesson.quiz.score(2, 5))).toBeInTheDocument();
    expect(screen.getByText(gu.lesson.quiz.failed)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: gu.glossary.continue }),
    ).toBeNull();
    flush();
    const saved = storage.saved();
    expect(saved.lessons[LESSON_ID]).toMatchObject({
      status: 'in_progress',
      bestQuiz: 2,
      quizAttempts: 1,
    });
    expect(saved.srs).toEqual({});
    // The 3 wrong quiz answers are in the mistakes list.
    expect(saved.mistakes).toHaveLength(3);
  });

  it('quiz again starts over with the same questions and then passes', async () => {
    const { user, storage } = open(seedAtQuiz());
    await answerQuiz(user, [false, false, false, false, false]);
    await user.click(
      screen.getByRole('button', { name: gu.lesson.quiz.again }),
    );
    expect(screen.getByText(gu.lesson.quiz.counter(1, 5))).toBeInTheDocument();
    await answerQuiz(user, [true, true, true, true, true]);
    expect(screen.getByText(gu.lesson.quiz.passed)).toBeInTheDocument();
    flush();
    expect(storage.saved().lessons[LESSON_ID]).toMatchObject({
      status: 'completed',
      bestQuiz: 5,
      quizAttempts: 2,
    });
  });

  it('read the lesson again goes back to the explanation', async () => {
    const { user } = open(seedAtQuiz());
    await answerQuiz(user, [false, false, false, false, false]);
    await user.click(
      screen.getByRole('button', { name: gu.lesson.quiz.reread }),
    );
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[3]);
  });

  it('a quiz question is answered once: no try-again button', async () => {
    const { user } = open(seedAtQuiz());
    await answer(user, lesson().quiz[0]!, false);
    expect(
      screen.queryByRole('button', { name: gu.glossary.tryAgain }),
    ).toBeNull();
  });
});

describe('LessonPlayer with a completed lesson', () => {
  it('opens from the start and does not undo the completion', async () => {
    const progress = createEmptyProgress('2026-10-24T08:00:00.000Z');
    progress.lessons[LESSON_ID] = {
      status: 'completed',
      step: 9,
      bestQuiz: 4,
      quizAttempts: 1,
      completedAt: '2026-10-24T09:00:00.000Z',
    };
    const storage = new MemoryStorage().seed(progress);
    const { user } = open(storage);
    expect(stepHeading()).toHaveTextContent(gu.lesson.stepNames[2]);
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    flush();
    expect(storage.saved().lessons[LESSON_ID]).toMatchObject({
      status: 'completed',
      step: 9,
    });
  });
});
