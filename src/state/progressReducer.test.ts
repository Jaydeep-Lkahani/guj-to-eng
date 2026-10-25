import { describe, expect, it } from 'vitest';
import { createEmptyProgress } from '../lib/progress';
import { ProgressSchema } from '../schema/progress';
import { progressReducer, type ProgressAction } from './progressReducer';

const AT = '2026-10-25T08:00:00.000Z';
const TODAY = '2026-10-25';

function run(actions: ProgressAction[]) {
  const progress = actions.reduce(progressReducer, createEmptyProgress(AT));
  expect(ProgressSchema.safeParse(progress).success).toBe(true);
  return progress;
}

const complete = (
  lessonId = 'p1-t01-l01',
  minutes = 20,
): Extract<ProgressAction, { type: 'completeLesson' }> => ({
  type: 'completeLesson',
  lessonId,
  estimatedMinutes: minutes,
  newWordIds: ['w-apple', 'w-ball'],
  today: TODAY,
  at: AT,
});

describe('setStep', () => {
  it('starts a lesson and saves the step', () => {
    const progress = run([{ type: 'setStep', lessonId: 'a', step: 5 }]);
    expect(progress.lessons.a).toEqual({
      status: 'in_progress',
      step: 5,
      bestQuiz: 0,
      quizAttempts: 0,
    });
  });

  it('can go back to an earlier step', () => {
    const progress = run([
      { type: 'setStep', lessonId: 'a', step: 8 },
      { type: 'setStep', lessonId: 'a', step: 3 },
    ]);
    expect(progress.lessons.a?.step).toBe(3);
  });

  it('does not move a completed lesson', () => {
    const progress = run([
      complete('a'),
      { type: 'setStep', lessonId: 'a', step: 3 },
    ]);
    expect(progress.lessons.a).toMatchObject({ status: 'completed', step: 9 });
  });
});

describe('recordQuiz', () => {
  it('keeps the best score and counts attempts', () => {
    const progress = run([
      { type: 'recordQuiz', lessonId: 'a', score: 2 },
      { type: 'recordQuiz', lessonId: 'a', score: 4 },
      { type: 'recordQuiz', lessonId: 'a', score: 3 },
    ]);
    expect(progress.lessons.a).toMatchObject({ bestQuiz: 4, quizAttempts: 3 });
  });

  it('keeps the status of a completed lesson', () => {
    const progress = run([
      complete('a'),
      { type: 'recordQuiz', lessonId: 'a', score: 5 },
    ]);
    expect(progress.lessons.a).toMatchObject({
      status: 'completed',
      bestQuiz: 5,
      quizAttempts: 1,
    });
  });
});

describe('completeLesson', () => {
  it('completes the lesson, adds new words to box 1 due tomorrow, and counts the day', () => {
    const progress = run([complete()]);
    expect(progress.lessons['p1-t01-l01']).toMatchObject({
      status: 'completed',
      step: 9,
      completedAt: AT,
    });
    expect(progress.srs['w-apple']).toEqual({
      box: 1,
      due: '2026-10-26',
      right: 0,
      wrong: 0,
    });
    expect(Object.keys(progress.srs)).toEqual(['w-apple', 'w-ball']);
    expect(progress.days[TODAY]).toEqual({
      lessons: 1,
      reviews: 0,
      tests: 0,
      minutes: 20,
    });
  });

  it('due date crosses a month and a year end', () => {
    const progress = run([{ ...complete(), today: '2026-12-31' }]);
    expect(progress.srs['w-apple']?.due).toBe('2027-01-01');
  });

  it('counts only the first completion', () => {
    const progress = run([complete(), complete()]);
    expect(progress.days[TODAY]?.lessons).toBe(1);
    expect(progress.days[TODAY]?.minutes).toBe(20);
  });

  it('does not reset a word that is already being revised', () => {
    const first = run([complete('a')]);
    const advanced = {
      ...first,
      srs: {
        ...first.srs,
        'w-apple': { box: 3 as const, due: '2026-11-05', right: 2, wrong: 0 },
      },
    };
    const next = progressReducer(advanced, complete('b'));
    expect(next.srs['w-apple']).toEqual({
      box: 3,
      due: '2026-11-05',
      right: 2,
      wrong: 0,
    });
  });

  it('adds up two lessons on the same day', () => {
    const progress = run([complete('a', 20), complete('b', 15)]);
    expect(progress.days[TODAY]).toMatchObject({ lessons: 2, minutes: 35 });
  });

  it('keeps quiz numbers recorded before completion', () => {
    const progress = run([
      { type: 'recordQuiz', lessonId: 'a', score: 4 },
      complete('a'),
    ]);
    expect(progress.lessons.a).toMatchObject({ bestQuiz: 4, quizAttempts: 1 });
  });
});

describe('addMistake', () => {
  const mistake = (n: number) => ({
    exerciseId: `p1-t01-l01-practice-${n}`,
    lessonId: 'p1-t01-l01',
    answer: String(n),
    at: AT,
  });

  it('puts the newest first', () => {
    const progress = run([
      { type: 'addMistake', mistake: mistake(1) },
      { type: 'addMistake', mistake: mistake(2) },
    ]);
    expect(progress.mistakes.map((m) => m.answer)).toEqual(['2', '1']);
  });

  it('keeps at most 300', () => {
    const actions: ProgressAction[] = Array.from({ length: 305 }, (_, i) => ({
      type: 'addMistake',
      mistake: mistake(i),
    }));
    const progress = run(actions);
    expect(progress.mistakes).toHaveLength(300);
    expect(progress.mistakes[0]?.answer).toBe('304');
  });
});

describe('setVideoProgress', () => {
  const base = {
    type: 'setVideoProgress',
    videoId: 'v-x',
    today: TODAY,
    at: AT,
  } as const;

  it('saves the position', () => {
    const progress = run([
      { ...base, lastPosition: 30, duration: 600, watched: false },
    ]);
    expect(progress.videos['v-x']).toEqual({
      lastPosition: 30,
      duration: 600,
      watched: false,
    });
    expect(progress.days[TODAY]).toBeUndefined();
  });

  it('marks watched once, adds the minutes of the video once', () => {
    const progress = run([
      { ...base, lastPosition: 590, duration: 600, watched: true },
      { ...base, lastPosition: 600, duration: 600, watched: true },
    ]);
    expect(progress.videos['v-x']).toMatchObject({
      watched: true,
      watchedAt: AT,
    });
    expect(progress.days[TODAY]?.minutes).toBe(10);
  });

  it('rounds the minutes of the video', () => {
    const progress = run([
      { ...base, lastPosition: 0, duration: 400, watched: true },
    ]);
    expect(progress.days[TODAY]?.minutes).toBe(7);
  });

  it('stays watched when she starts it again', () => {
    const progress = run([
      { ...base, lastPosition: 600, duration: 600, watched: true },
      { ...base, lastPosition: 10, duration: 600, watched: false },
    ]);
    expect(progress.videos['v-x']).toMatchObject({
      lastPosition: 10,
      watched: true,
      watchedAt: AT,
    });
  });
});

describe('saveWriting', () => {
  it('keeps the last 5 writings per task', () => {
    const actions: ProgressAction[] = Array.from({ length: 7 }, (_, i) => ({
      type: 'saveWriting',
      taskId: 't',
      text: `text ${i}`,
      at: AT,
    }));
    const progress = run(actions);
    expect(progress.writings.t?.map((w) => w.text)).toEqual([
      'text 2',
      'text 3',
      'text 4',
      'text 5',
      'text 6',
    ]);
  });
});

describe('replace', () => {
  it('swaps the whole progress', () => {
    const other = createEmptyProgress('2027-01-01T00:00:00.000Z');
    expect(
      progressReducer(createEmptyProgress(AT), {
        type: 'replace',
        progress: other,
      }),
    ).toBe(other);
  });
});
