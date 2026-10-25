import { describe, expect, it } from 'vitest';
import type { Exercise } from '../schema/content';
import {
  gradeExercise,
  gradeText,
  isAnswerReady,
  isMatchPair,
  type Answer,
} from './grading';

const base = { id: 'x', promptGu: 'પ્રશ્ન', explainGu: 'કારણ' };

const mcq: Exercise = {
  ...base,
  type: 'mcq',
  options: ['a', 'b', 'C'],
  answer: 2,
};
const listenChoose: Exercise = {
  ...base,
  type: 'listenChoose',
  audio: 'Ball',
  options: ['Ball', 'Cat'],
  answer: 0,
};
const trueFalse: Exercise = {
  ...base,
  type: 'trueFalse',
  statementEn: 'b = d',
  answer: false,
};
const fill: Exercise = {
  ...base,
  type: 'fill',
  sentence: 'My name ___ Hetal.',
  answers: ['is'],
};
const sentenceFill: Exercise = {
  ...base,
  type: 'fill',
  sentence: '___',
  answers: ['I am Hetal', "I'm Hetal"],
};
const listenType: Exercise = {
  ...base,
  type: 'listenType',
  audio: 'Egg',
  answers: ['egg'],
};
const translate: Exercise = {
  ...base,
  type: 'translate',
  gu: 'સફરજન',
  answers: ['apple'],
};
const order: Exercise = {
  ...base,
  type: 'order',
  tiles: ['I', 'drink', 'tea'],
  answers: ['I drink tea'],
};
const match: Exercise = {
  ...base,
  type: 'match',
  pairs: [
    { left: 'A', right: 'a' },
    { left: 'B', right: 'b' },
    { left: 'C', right: 'c' },
  ],
};

describe('gradeText', () => {
  it('accepts any listed answer after normalizing', () => {
    expect(gradeText('  I   AM Hetal. ', ['I am Hetal']).correct).toBe(true);
    expect(gradeText('I’m Hetal!', ["I'm Hetal"]).correct).toBe(true);
  });

  it('never guesses synonyms', () => {
    expect(gradeText('I am Hetal', ["I'm Hetal"]).correct).toBe(false);
    expect(gradeText('dog', ['cat']).correct).toBe(false);
  });

  it('marks an empty answer wrong', () => {
    expect(gradeText('', ['egg']).correct).toBe(false);
    expect(gradeText('   ', ['egg']).correct).toBe(false);
  });

  it('shows the capital-letter tip for a right sentence that starts with a small letter', () => {
    expect(gradeText('i am hetal', ['I am Hetal'])).toEqual({
      correct: true,
      capitalTip: true,
    });
  });

  it('shows no tip when the capital is right, or the answer is a single word', () => {
    expect(gradeText('I am Hetal', ['I am Hetal']).capitalTip).toBe(false);
    expect(gradeText('ball', ['Ball']).capitalTip).toBe(false);
  });

  it('shows no tip when a listed answer is exactly what she typed', () => {
    expect(gradeText('i am here', ['I am here', 'i am here']).capitalTip).toBe(
      false,
    );
  });

  it('shows no tip for a wrong answer', () => {
    expect(gradeText('i am rita', ['I am Hetal']).capitalTip).toBe(false);
  });
});

describe('gradeExercise', () => {
  it('mcq: right and wrong', () => {
    const right = gradeExercise(mcq, { kind: 'index', value: 2 });
    expect(right).toMatchObject({
      correct: true,
      correctText: 'C',
      answerText: 'C',
    });
    const wrong = gradeExercise(mcq, { kind: 'index', value: 0 });
    expect(wrong).toMatchObject({
      correct: false,
      correctText: 'C',
      answerText: 'a',
    });
  });

  it('listenChoose: right and wrong', () => {
    expect(
      gradeExercise(listenChoose, { kind: 'index', value: 0 }).correct,
    ).toBe(true);
    expect(
      gradeExercise(listenChoose, { kind: 'index', value: 1 }).correct,
    ).toBe(false);
  });

  it('trueFalse: right and wrong', () => {
    expect(
      gradeExercise(trueFalse, { kind: 'bool', value: false }).correct,
    ).toBe(true);
    expect(
      gradeExercise(trueFalse, { kind: 'bool', value: true }).correct,
    ).toBe(false);
  });

  it('fill: right and wrong', () => {
    expect(gradeExercise(fill, { kind: 'text', value: ' Is ' }).correct).toBe(
      true,
    );
    const wrong = gradeExercise(fill, { kind: 'text', value: 'are' });
    expect(wrong).toMatchObject({
      correct: false,
      correctText: 'is',
      answerText: 'are',
    });
  });

  it('fill with a sentence answer: tip for a small first letter', () => {
    const grade = gradeExercise(sentenceFill, {
      kind: 'text',
      value: 'i am hetal.',
    });
    expect(grade).toMatchObject({ correct: true, capitalTip: true });
  });

  it('listenType and translate: right and wrong', () => {
    expect(
      gradeExercise(listenType, { kind: 'text', value: 'Egg' }).correct,
    ).toBe(true);
    expect(
      gradeExercise(listenType, { kind: 'text', value: 'eg' }).correct,
    ).toBe(false);
    expect(
      gradeExercise(translate, { kind: 'text', value: 'apple' }).correct,
    ).toBe(true);
    expect(
      gradeExercise(translate, { kind: 'text', value: 'mango' }).correct,
    ).toBe(false);
  });

  it('order: joins the tiles with spaces', () => {
    const right = gradeExercise(order, {
      kind: 'tiles',
      value: ['I', 'drink', 'tea'],
    });
    expect(right).toMatchObject({ correct: true, answerText: 'I drink tea' });
    const wrong = gradeExercise(order, {
      kind: 'tiles',
      value: ['tea', 'drink', 'I'],
    });
    expect(wrong).toMatchObject({ correct: false, correctText: 'I drink tea' });
  });

  it('match: practice allows wrong taps, a quiz does not', () => {
    const clean: Answer = { kind: 'match', wrongPairs: [] };
    const messy: Answer = { kind: 'match', wrongPairs: ['A → b', 'B → a'] };
    expect(gradeExercise(match, clean, { retries: false }).correct).toBe(true);
    expect(gradeExercise(match, messy, { retries: false }).correct).toBe(false);
    expect(gradeExercise(match, messy, { retries: true }).correct).toBe(true);
    expect(gradeExercise(match, clean).correctText).toBe('A – a, B – b, C – c');
    expect(gradeExercise(match, messy).answerText).toBe('A → b, B → a');
  });

  it('match: wrong taps go to the mistakes notebook even when practice counts it correct', () => {
    expect(
      gradeExercise(match, { kind: 'match', wrongPairs: [] }).mistake,
    ).toBe(false);
    const messy = gradeExercise(match, {
      kind: 'match',
      wrongPairs: ['A → b'],
    });
    expect(messy).toMatchObject({ correct: true, mistake: true });
  });

  it('a wrong answer is a mistake, a right one is not', () => {
    expect(gradeExercise(mcq, { kind: 'index', value: 0 }).mistake).toBe(true);
    expect(gradeExercise(mcq, { kind: 'index', value: 2 }).mistake).toBe(false);
    expect(
      gradeExercise(trueFalse, { kind: 'bool', value: true }).mistake,
    ).toBe(true);
    expect(gradeExercise(fill, { kind: 'text', value: 'are' }).mistake).toBe(
      true,
    );
    expect(
      gradeExercise(order, { kind: 'tiles', value: ['I', 'drink', 'tea'] })
        .mistake,
    ).toBe(false);
  });

  it('throws when the answer kind does not fit', () => {
    expect(() => gradeExercise(mcq, { kind: 'text', value: 'x' })).toThrow();
    expect(() => gradeExercise(fill, { kind: 'index', value: 0 })).toThrow();
  });
});

describe('isMatchPair', () => {
  it('is true only for a belonging pair', () => {
    expect(
      isMatchPair(match.type === 'match' ? match.pairs : [], 'A', 'a'),
    ).toBe(true);
    expect(
      isMatchPair(match.type === 'match' ? match.pairs : [], 'A', 'b'),
    ).toBe(false);
  });
});

describe('isAnswerReady', () => {
  it('is false without an answer', () => {
    expect(isAnswerReady(mcq, undefined)).toBe(false);
  });

  it('needs a chosen option, a typed text, all tiles', () => {
    expect(isAnswerReady(mcq, { kind: 'index', value: -1 })).toBe(false);
    expect(isAnswerReady(mcq, { kind: 'index', value: 0 })).toBe(true);
    expect(isAnswerReady(trueFalse, { kind: 'bool', value: false })).toBe(true);
    expect(isAnswerReady(fill, { kind: 'text', value: '  ' })).toBe(false);
    expect(isAnswerReady(fill, { kind: 'text', value: 'is' })).toBe(true);
    expect(isAnswerReady(order, { kind: 'tiles', value: ['I'] })).toBe(false);
    expect(
      isAnswerReady(order, { kind: 'tiles', value: ['I', 'drink', 'tea'] }),
    ).toBe(true);
    expect(isAnswerReady(match, { kind: 'match', wrongPairs: [] })).toBe(true);
  });
});
