import { describe, expect, it } from 'vitest';
import { makeBundle, toFiles } from '../test/contentFixture';
import { buildContent } from './content';
import { createEmptyProgress } from './progress';
import { buildWarmup } from './warmup';
import type { Progress } from '../schema/progress';

const content = buildContent(toFiles(makeBundle()));
const TODAY = '2026-10-25';
// recommendedOrder: p1-t01-l01, p1-t02-l01, p1-t01-l02

function progress(edit?: (p: Progress) => void): Progress {
  const p = createEmptyProgress('2026-10-24T08:00:00.000Z');
  edit?.(p);
  return p;
}

const due = (date: string) => ({
  box: 1 as const,
  due: date,
  right: 0,
  wrong: 0,
});

describe('buildWarmup', () => {
  it('is empty for the very first lesson', () => {
    expect(buildWarmup(content, progress(), 'p1-t01-l01', TODAY)).toEqual([]);
  });

  it('is empty when the lesson before is not completed and no card is due', () => {
    expect(buildWarmup(content, progress(), 'p1-t02-l01', TODAY)).toEqual([]);
  });

  it('uses quiz questions of the lesson before when it is completed', () => {
    const p = progress((x) => {
      x.lessons['p1-t01-l01'] = {
        status: 'completed',
        step: 9,
        bestQuiz: 5,
        quizAttempts: 1,
      };
    });
    const items = buildWarmup(content, p, 'p1-t02-l01', TODAY);
    expect(items).toHaveLength(3);
    expect(items.every((i) => i.kind === 'question')).toBe(true);
    expect(
      items.map((i) => (i.kind === 'question' ? i.exercise.id : '')),
    ).toEqual([
      'p1-t01-l01-quiz-01',
      'p1-t01-l01-quiz-02',
      'p1-t01-l01-quiz-03',
    ]);
  });

  it('prefers due flashcards, oldest first, at most 3', () => {
    const p = progress((x) => {
      x.srs['w-ball'] = due('2026-10-24');
      x.srs['w-apple'] = due('2026-10-20');
    });
    const items = buildWarmup(content, p, 'p1-t02-l01', TODAY);
    expect(items.map((i) => (i.kind === 'card' ? i.word.id : ''))).toEqual([
      'w-apple',
      'w-ball',
    ]);
  });

  it('counts cards due today but not cards due tomorrow', () => {
    const p = progress((x) => {
      x.srs['w-apple'] = due(TODAY);
      x.srs['w-ball'] = due('2026-10-26');
    });
    const items = buildWarmup(content, p, 'p1-t02-l01', TODAY);
    expect(items).toHaveLength(1);
  });

  it('limits cards to 3', () => {
    const bundle = makeBundle();
    for (const id of ['w-cat', 'w-dog', 'w-egg']) {
      bundle.vocab.words.push({
        id,
        en: id.slice(2),
        gu: 'શબ્દ',
        translit: 'શબ્દ',
        pos: 'noun',
        phaseId: 'p1',
        topicId: 'p1-t01',
      });
    }
    const big = buildContent(toFiles(bundle));
    const p = progress((x) => {
      for (const id of ['w-apple', 'w-ball', 'w-cat', 'w-dog', 'w-egg']) {
        x.srs[id] = due('2026-10-24');
      }
    });
    expect(buildWarmup(big, p, 'p1-t02-l01', TODAY)).toHaveLength(3);
  });

  it('ignores cards of words that are not in the content', () => {
    const p = progress((x) => {
      x.srs['w-unknown'] = due('2026-10-20');
    });
    expect(buildWarmup(content, p, 'p1-t02-l01', TODAY)).toEqual([]);
  });
});
