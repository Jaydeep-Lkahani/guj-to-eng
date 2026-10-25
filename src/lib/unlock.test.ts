import { describe, expect, it } from 'vitest';
import { makeBundle, toFiles } from '../test/contentFixture';
import { buildContent } from './content';
import { createEmptyProgress } from './progress';
import { isPhaseUnlocked, isTestUnlocked, lessonLock } from './unlock';
import type { Progress } from '../schema/progress';

function twoPhaseContent() {
  const bundle = makeBundle();
  const first = bundle.phases.phases[0]!;
  bundle.phases.phases.push({
    ...first,
    id: 'p2',
    order: 2,
    finalTestId: 'p2-final',
    topics: [],
    recommendedOrder: [],
  });
  return buildContent(toFiles(bundle));
}

const content = twoPhaseContent();
// recommendedOrder of p1: p1-t01-l01, p1-t02-l01, p1-t01-l02

function progressWith(done: string[], extra?: (p: Progress) => void): Progress {
  const progress = createEmptyProgress('2026-10-25T08:00:00.000Z');
  for (const id of done) {
    progress.lessons[id] = {
      status: 'completed',
      step: 9,
      bestQuiz: 5,
      quizAttempts: 1,
    };
  }
  extra?.(progress);
  return progress;
}

describe('lessonLock', () => {
  it('opens the first lesson of the first phase', () => {
    expect(lessonLock(content, progressWith([]), 'p1-t01-l01')).toEqual({
      unlocked: true,
    });
  });

  it('keeps a lesson locked until the one before it (in recommended order) is completed', () => {
    expect(lessonLock(content, progressWith([]), 'p1-t02-l01')).toEqual({
      unlocked: false,
      reason: 'previousLesson',
    });
    expect(
      lessonLock(content, progressWith(['p1-t01-l01']), 'p1-t02-l01'),
    ).toEqual({ unlocked: true });
  });

  it('follows the recommended order, not the topic order', () => {
    // l02 of topic 1 comes after the lesson of topic 2.
    const afterFirst = progressWith(['p1-t01-l01']);
    expect(lessonLock(content, afterFirst, 'p1-t01-l02')).toMatchObject({
      unlocked: false,
    });
    const afterSecond = progressWith(['p1-t01-l01', 'p1-t02-l01']);
    expect(lessonLock(content, afterSecond, 'p1-t01-l02')).toEqual({
      unlocked: true,
    });
  });

  it('an in-progress lesson does not open the next one', () => {
    const progress = progressWith([], (p) => {
      p.lessons['p1-t01-l01'] = {
        status: 'in_progress',
        step: 8,
        bestQuiz: 2,
        quizAttempts: 1,
      };
    });
    expect(lessonLock(content, progress, 'p1-t02-l01')).toMatchObject({
      unlocked: false,
    });
  });

  it('returns undefined for a lesson that is in no phase', () => {
    expect(lessonLock(content, progressWith([]), 'p9-t99-l01')).toBeUndefined();
  });

  it('unlockAll opens everything', () => {
    const progress = progressWith([], (p) => {
      p.settings.unlockAll = true;
    });
    expect(lessonLock(content, progress, 'p1-t01-l02')).toEqual({
      unlocked: true,
    });
  });
});

describe('isPhaseUnlocked', () => {
  it('opens phase 1 always and phase 2 only after the phase 1 test is passed', () => {
    expect(isPhaseUnlocked(content, progressWith([]), 'p1')).toBe(true);
    expect(isPhaseUnlocked(content, progressWith([]), 'p2')).toBe(false);
    const attemptedOnly = progressWith([], (p) => {
      p.tests['p1-final'] = { bestPercent: 60, attempts: 1 };
    });
    expect(isPhaseUnlocked(content, attemptedOnly, 'p2')).toBe(false);
    const passed = progressWith([], (p) => {
      p.tests['p1-final'] = {
        bestPercent: 80,
        attempts: 1,
        passedAt: '2026-10-25T08:00:00.000Z',
      };
    });
    expect(isPhaseUnlocked(content, passed, 'p2')).toBe(true);
  });

  it('unlockAll opens every phase, an unknown phase stays closed', () => {
    const progress = progressWith([], (p) => {
      p.settings.unlockAll = true;
    });
    expect(isPhaseUnlocked(content, progress, 'p2')).toBe(true);
    expect(isPhaseUnlocked(content, progressWith([]), 'p9')).toBe(false);
  });
});

describe('lessons of a locked phase', () => {
  it('say that the earlier test is needed', () => {
    const bundle = makeBundle();
    const first = bundle.phases.phases[0]!;
    bundle.phases.phases.push({
      ...first,
      id: 'p2',
      order: 2,
      finalTestId: 'p2-final',
      topics: [],
      recommendedOrder: ['p1-t01-l01'],
    });
    first.recommendedOrder = ['p1-t02-l01'];
    const built = buildContent(toFiles(bundle));
    expect(lessonLock(built, progressWith([]), 'p1-t01-l01')).toEqual({
      unlocked: false,
      reason: 'previousPhaseTest',
    });
  });
});

describe('isTestUnlocked', () => {
  it('needs every lesson of the phase completed', () => {
    const all = ['p1-t01-l01', 'p1-t02-l01', 'p1-t01-l02'];
    expect(isTestUnlocked(content, progressWith(all.slice(0, 2)), 'p1')).toBe(
      false,
    );
    expect(isTestUnlocked(content, progressWith(all), 'p1')).toBe(true);
  });

  it('stays closed in a locked phase, opens with unlockAll', () => {
    expect(isTestUnlocked(content, progressWith([]), 'p2')).toBe(false);
    const progress = progressWith([], (p) => {
      p.settings.unlockAll = true;
    });
    expect(isTestUnlocked(content, progress, 'p2')).toBe(true);
    expect(isTestUnlocked(content, progressWith([]), 'p9')).toBe(false);
  });
});
