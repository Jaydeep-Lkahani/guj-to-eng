import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gu } from '../../i18n/gu';
import type { Grade } from '../../lib/grading';
import type { Exercise } from '../../schema/content';
import { ProgressProvider } from '../../state/ProgressProvider';
import { MemoryStorage } from '../../test/memoryStorage';
import { ExerciseView, type ExerciseMode } from './ExerciseView';

const base = { id: 'x', promptGu: 'પ્રશ્ન', explainGu: 'કારણ સમજાવ્યું.' };

const exercises = {
  mcq: {
    ...base,
    type: 'mcq',
    options: ['a', 'b', 'C', 'd'],
    answer: 2,
  },
  trueFalse: {
    ...base,
    type: 'trueFalse',
    statementEn: 'b = d',
    answer: false,
  },
  fill: {
    ...base,
    type: 'fill',
    sentence: 'My name ___ Hetal.',
    answers: ['is'],
  },
  order: {
    ...base,
    type: 'order',
    tiles: ['I', 'drink', 'tea'],
    answers: ['I drink tea'],
  },
  match: {
    ...base,
    type: 'match',
    pairs: [
      { left: 'A', right: 'a' },
      { left: 'B', right: 'b' },
      { left: 'C', right: 'c' },
    ],
  },
  listenChoose: {
    ...base,
    type: 'listenChoose',
    audio: 'Ball',
    options: ['Ball', 'Cat', 'Dog'],
    answer: 0,
  },
  listenType: { ...base, type: 'listenType', audio: 'Egg', answers: ['egg'] },
  translate: { ...base, type: 'translate', gu: 'સફરજન', answers: ['apple'] },
} satisfies Record<string, Exercise>;

function setup(exercise: Exercise, mode: ExerciseMode = 'practice') {
  const onChecked = vi.fn<(exercise: Exercise, grade: Grade) => void>();
  const onNext = vi.fn();
  render(
    <ProgressProvider storage={new MemoryStorage()}>
      <ExerciseView
        exercise={exercise}
        mode={mode}
        onChecked={onChecked}
        onNext={onNext}
      />
    </ProgressProvider>,
  );
  return { onChecked, onNext, user: userEvent.setup() };
}

const check = () => screen.getByRole('button', { name: gu.glossary.check });
const status = () => screen.getByRole('status');

describe('ExerciseView: every type, right and wrong', () => {
  it('mcq: right answer', async () => {
    const { user, onChecked } = setup(exercises.mcq);
    expect(check()).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'C' }));
    await user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
    expect(status()).toHaveTextContent(base.explainGu);
    expect(onChecked).toHaveBeenCalledTimes(1);
    expect(onChecked.mock.calls[0]![1]).toMatchObject({
      correct: true,
      mistake: false,
    });
  });

  it('mcq: wrong answer shows the right one and the reason', async () => {
    const { user, onChecked } = setup(exercises.mcq);
    await user.click(screen.getByRole('radio', { name: 'a' }));
    await user.click(check());
    expect(status()).toHaveTextContent(gu.exercise.wrongPrefix);
    expect(status()).toHaveTextContent('C');
    expect(status()).toHaveTextContent(base.explainGu);
    expect(onChecked.mock.calls[0]![1]).toMatchObject({
      correct: false,
      mistake: true,
      answerText: 'a',
    });
  });

  it('trueFalse: right and wrong, with Gujarati labels', async () => {
    const first = setup(exercises.trueFalse);
    await first.user.click(
      screen.getByRole('radio', { name: gu.exercise.falseLabel }),
    );
    await first.user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
  });

  it('trueFalse: wrong answer names the right one in Gujarati', async () => {
    const { user } = setup(exercises.trueFalse);
    await user.click(
      screen.getByRole('radio', { name: gu.exercise.trueLabel }),
    );
    await user.click(check());
    expect(status()).toHaveTextContent(
      `${gu.exercise.wrongPrefix} ${gu.exercise.falseLabel}`,
    );
  });

  it('fill: right (with a capital) and wrong', async () => {
    const right = setup(exercises.fill);
    await right.user.type(screen.getByRole('textbox'), 'IS');
    await right.user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
  });

  it('fill: wrong answer', async () => {
    const { user } = setup(exercises.fill);
    await user.type(screen.getByRole('textbox'), 'are');
    await user.click(check());
    expect(status()).toHaveTextContent(gu.exercise.wrongPrefix);
  });

  it('fill: pressing Enter checks the answer', async () => {
    const { user } = setup(exercises.fill);
    await user.type(screen.getByRole('textbox'), 'is{Enter}');
    expect(status()).toHaveTextContent(gu.glossary.correct);
  });

  it('typed answers never get browser help', () => {
    setup(exercises.translate);
    const box = screen.getByRole('textbox');
    expect(box).toHaveAttribute('lang', 'en');
    expect(box).toHaveAttribute('spellcheck', 'false');
    expect(box).toHaveAttribute('autocapitalize', 'off');
    expect(box).toHaveAttribute('autocorrect', 'off');
  });

  it('translate: right and wrong', async () => {
    const right = setup(exercises.translate);
    expect(screen.getByText('સફરજન')).toBeInTheDocument();
    await right.user.type(screen.getByRole('textbox'), ' Apple. ');
    await right.user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
  });

  it('translate: wrong answer', async () => {
    const { user } = setup(exercises.translate);
    await user.type(screen.getByRole('textbox'), 'mango');
    await user.click(check());
    expect(status()).toHaveTextContent(gu.exercise.wrongPrefix);
  });

  it('listenType: shows the text when there is no English voice, and grades the typing', async () => {
    const { user } = setup(exercises.listenType);
    expect(
      screen.getByText(gu.exercise.audioFallback, { exact: false }),
    ).toBeInTheDocument();
    await user.type(screen.getByRole('textbox'), 'egg');
    await user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
  });

  it('listenChoose: right and wrong', async () => {
    const right = setup(exercises.listenChoose);
    await right.user.click(screen.getByRole('radio', { name: 'Ball' }));
    await right.user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
  });

  it('listenChoose: wrong answer', async () => {
    const { user } = setup(exercises.listenChoose);
    await user.click(screen.getByRole('radio', { name: 'Dog' }));
    await user.click(check());
    expect(status()).toHaveTextContent(gu.exercise.wrongPrefix);
  });

  it('order: right sentence from tiles', async () => {
    const { user, onChecked } = setup(exercises.order);
    expect(check()).toBeDisabled();
    for (const word of ['I', 'drink', 'tea']) {
      await user.click(screen.getByRole('button', { name: word }));
    }
    await user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
    expect(onChecked.mock.calls[0]![1].answerText).toBe('I drink tea');
  });

  it('order: wrong sentence, and a tile can be taken out again', async () => {
    const { user } = setup(exercises.order);
    await user.click(screen.getByRole('button', { name: 'tea' }));
    const answerArea = screen.getByRole('group', {
      name: gu.exercise.tilesAnswer,
    });
    expect(
      within(answerArea).getByRole('button', { name: 'tea' }),
    ).toBeInTheDocument();
    await user.click(within(answerArea).getByRole('button', { name: 'tea' }));
    expect(within(answerArea).queryByRole('button')).toBeNull();

    for (const word of ['tea', 'drink', 'I']) {
      await user.click(screen.getByRole('button', { name: word }));
    }
    await user.click(check());
    expect(status()).toHaveTextContent(gu.exercise.wrongPrefix);
    expect(status()).toHaveTextContent('I drink tea');
  });

  it('order: the tiles are not shown in the right order at the start', () => {
    setup(exercises.order);
    const pool = screen.getByRole('group', { name: gu.exercise.tilesPool });
    const words = within(pool)
      .getAllByRole('button')
      .map((b) => b.textContent);
    expect(words).not.toEqual(['I', 'drink', 'tea']);
    expect([...words].sort()).toEqual(['I', 'drink', 'tea']);
  });
});

describe('ExerciseView: match', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  const left = (name: string) =>
    within(screen.getByRole('list', { name: gu.exercise.matchLeft })).getByRole(
      'button',
      { name: new RegExp(`^${name}`) },
    );
  const right = (name: string) =>
    within(
      screen.getByRole('list', { name: gu.exercise.matchRight }),
    ).getByRole('button', { name: new RegExp(`^${name}`) });

  it('is correct when every pair is joined, with no check button', async () => {
    const { user, onChecked } = setup(exercises.match);
    expect(
      screen.queryByRole('button', { name: gu.glossary.check }),
    ).toBeNull();
    for (const [l, r] of [
      ['A', 'a'],
      ['B', 'b'],
      ['C', 'c'],
    ] as const) {
      await user.click(left(l));
      await user.click(right(r));
    }
    expect(status()).toHaveTextContent(gu.glossary.correct);
    expect(onChecked.mock.calls[0]![1]).toMatchObject({
      correct: true,
      mistake: false,
    });
  });

  it('a wrong tap flashes ✖ for 1 second and does not join the pair', async () => {
    const { user } = setup(exercises.match);
    await user.click(left('A'));
    await user.click(right('b'));
    expect(
      screen.getByRole('img', { name: gu.glossary.wrong }),
    ).toBeInTheDocument();
    expect(right('b')).toBeEnabled();
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(
      screen.queryByRole('img', { name: gu.glossary.wrong }),
    ).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole('img', { name: gu.glossary.wrong })).toBeNull();
  });

  it('in practice, wrong taps are saved as a mistake but the exercise still ends right', async () => {
    const { user, onChecked } = setup(exercises.match, 'practice');
    await user.click(left('A'));
    await user.click(right('b'));
    for (const [l, r] of [
      ['A', 'a'],
      ['B', 'b'],
      ['C', 'c'],
    ] as const) {
      await user.click(left(l));
      await user.click(right(r));
    }
    expect(onChecked.mock.calls[0]![1]).toMatchObject({
      correct: true,
      mistake: true,
      answerText: 'A → b',
    });
  });

  it('in a quiz, a wrong tap makes the question wrong', async () => {
    const { user, onChecked } = setup(exercises.match, 'quiz');
    await user.click(left('A'));
    await user.click(right('c'));
    for (const [l, r] of [
      ['A', 'a'],
      ['B', 'b'],
      ['C', 'c'],
    ] as const) {
      await user.click(left(l));
      await user.click(right(r));
    }
    expect(onChecked.mock.calls[0]![1]).toMatchObject({ correct: false });
    expect(status()).toHaveTextContent(gu.exercise.wrongPrefix);
  });

  it('ignores a tap on the right side before a left item is chosen', async () => {
    const { user } = setup(exercises.match);
    await user.click(right('a'));
    expect(screen.queryByRole('img', { name: gu.glossary.wrong })).toBeNull();
  });
});

describe('ExerciseView: practice and quiz modes', () => {
  it('practice: a wrong answer can be tried again', async () => {
    const { user, onChecked, onNext } = setup(exercises.mcq, 'practice');
    await user.click(screen.getByRole('radio', { name: 'a' }));
    await user.click(check());
    await user.click(
      screen.getByRole('button', { name: gu.glossary.tryAgain }),
    );
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('radio', { name: 'a' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await user.click(screen.getByRole('radio', { name: 'C' }));
    await user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
    expect(onChecked).toHaveBeenCalledTimes(2);
    expect(onNext).not.toHaveBeenCalled();
  });

  it('practice: she can also move on after a wrong answer', async () => {
    const { user, onNext } = setup(exercises.mcq, 'practice');
    await user.click(screen.getByRole('radio', { name: 'a' }));
    await user.click(check());
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('quiz: no retry after a wrong answer', async () => {
    const { user, onNext } = setup(exercises.mcq, 'quiz');
    await user.click(screen.getByRole('radio', { name: 'a' }));
    await user.click(check());
    expect(
      screen.queryByRole('button', { name: gu.glossary.tryAgain }),
    ).toBeNull();
    await user.click(screen.getByRole('button', { name: gu.glossary.next }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('the options cannot be changed after checking', async () => {
    const { user } = setup(exercises.mcq, 'quiz');
    await user.click(screen.getByRole('radio', { name: 'a' }));
    await user.click(check());
    expect(screen.getByRole('radio', { name: 'C' })).toBeDisabled();
  });

  it('shows the capital-letter tip for a right sentence with a small first letter', async () => {
    const { user } = setup({
      ...base,
      type: 'translate',
      gu: 'હું હેતલ છું',
      answers: ['I am Hetal'],
    });
    await user.type(screen.getByRole('textbox'), 'i am hetal');
    await user.click(check());
    expect(status()).toHaveTextContent(gu.glossary.correct);
    expect(status()).toHaveTextContent(gu.exercise.capitalTip);
  });

  it('marks right and wrong with a sign and words, not only colour', async () => {
    const { user } = setup(exercises.mcq);
    await user.click(screen.getByRole('radio', { name: 'a' }));
    await user.click(check());
    expect(status()).toHaveTextContent('✖');
  });
});
